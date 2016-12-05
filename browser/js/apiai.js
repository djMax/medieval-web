import uuid from 'uuid';
import request from 'superagent';
import * as animate from './animate';

const sessionId = uuid.v4();
const token = 'd34008bf305c404bb394929e0e41aef7';

export default async function interpret(query) {
  animate.goSpinner();
  try {
    const { body: apiai } = await request
      .get('https://api.api.ai/api/query?v=20150910&lang=en')
      .query({
        query,
        sessionId,
      })
      .set('Authorization', `Bearer ${token}`);
    return apiai;
  } finally {
    animate.stopSpinner();
  }
}
