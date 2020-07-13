import meow from 'meow';
import execa from 'execa';
import tabtab from 'tabtab';
import dotenv from 'dotenv';
import { completion, installOrUninstallCompletion } from './autocompletion';
import { getParsedOpNoteContent } from './1password';

const meowCli = () => meow(`
    Usage
      1. Authenticate your current session via the official 1Password CLI
      $ op signin
      
      2. Set environment variable from your 1Password note for your command
      $ openv <secret-note> -c <your-command>
    
      (optional) Install auto-completion for secret note names
      $ openv install-completion

    Options
      --command, -c   The command you want to execute
      --env, -e       Manually overwrite values from 1Password note
    
    Examples
      Login to your database using credentials from 1Password
      $ openv psql-secrets -c psql
      
      Run your web-app with 1Password configuration and overwrite API_URL
      $ openv web-app-env -c "npm run dev" -e "API_URL=http://localhost:3000"
      
      Export secret environment variables in current shell
      $ export $(openv my-secrets)
  `, {
  flags: {
    command: {
      type: 'string',
      alias: 'c',
    },
    env: {
      type: 'string',
      alias: 'e',
      isMultiple: true,
    },
  },
});

export default async function cli(args) {
  if (await installOrUninstallCompletion(args)) {
    return;
  }
  if (args[2] === 'completion') {
    const env = tabtab.parseEnv(process.env);
    await completion(env);
    return;
  }

  const meowCliInstance = meowCli();
  const { flags: { command, env }, input } = meowCliInstance;
  if (input.length !== 1) {
    meowCliInstance.showHelp();
    return;
  }
  const parsedOpEnv = await getParsedOpNoteContent(input[0]);
  const parsedParamEnv = env && env.length ? dotenv.parse(env.join('\n')) : {};
  const finalEnv = { ...parsedOpEnv, ...parsedParamEnv };
  if (command) {
    await execa(command, { shell: true, env: finalEnv, stdio: 'inherit' });
  } else {
    await execa('env', { env: finalEnv, extendEnv: false, stdio: 'inherit' });
  }
}
