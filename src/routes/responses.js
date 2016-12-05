import Spreadsheet from 'google-spreadsheet';

export default function routes(router) {
  router.get('/', (req, res) => {
    const doc = new Spreadsheet('1Q3jyxNm4XDWTYmYyEDsTpZ_IUCG8_hsNGHCZpqBhD54');

    doc.getInfo((err, info) => {
      const sheet = info.worksheets[0];
      sheet.getRows({
        offset: 1,
        limit: 200,
      }, (sheetError, rows) => {
        const responses = [];
        for (const r of rows) {
          const { subject, character, response } = r;
          responses.push({ subject, character, response });
        }
        res.json({ responses });
      });
    });
  });
}
