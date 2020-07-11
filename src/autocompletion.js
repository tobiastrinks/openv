import tabtab from 'tabtab';
import dotenv from 'dotenv';
import { getOpNoteTitles } from './1password';

export async function completion(env) {
  if (!env.complete) return tabtab.log([]);
  if (env.prev === 'openv') {
    return tabtab.log(await getOpNoteTitles());
  }
  return tabtab.log([]);
}

export async function installOrUninstallCompletion(args) {
  if (args[2] === 'install-completion') {
    await tabtab
      .install({
        name: 'openv',
        completer: 'openv',
      })
      .catch(console.error);
    return true;
  } if (args[2] === 'uninstall-completion') {
    await tabtab
      .uninstall({
        name: 'openv',
      })
      .catch(console.error);
    return true;
  }
  return false;
}
