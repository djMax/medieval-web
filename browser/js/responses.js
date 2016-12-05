import request from 'superagent';

export const responses = {
  isabella: {},
  brian: {},
  sierida: {},
};

export async function refresh() {
  const { body } = await request
    .get('responses')
    .accept('application/json');
  for (const r of body.responses) {
    if (r.character && responses[r.character.toLowerCase()]) {
      const char = responses[r.character.toLowerCase()];
      char[r.subject.toLowerCase()] = r.response;
    } else {
      console.log('Bad row', r);
    }
  }
}
