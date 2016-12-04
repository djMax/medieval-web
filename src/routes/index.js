export default function routes(router) {
  router.get('/hello', (req, res) => {
    res.json({ hello: 'world' });
  });
}
