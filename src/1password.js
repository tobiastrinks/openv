import execa from 'execa';
import dotenv from 'dotenv';

export async function getParsedOpNoteContent(noteTitle) {
  const { stdout } = await execa('op', ['get', 'item', noteTitle, '--fields', 'notes']);
  return dotenv.parse(stdout);
}

export async function getOpNoteTitles() {
  const { stdout } = await execa('op', ['list', 'items']);
  return JSON.parse(stdout)
    .filter((i) => i.templateUuid === '003')
    .map((i) => i.overview.title);
}
