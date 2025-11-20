describe('Real-time price flow', () => {
  it('shows live update banner when a new price is created', () => {
    // create a unique email for the test
    const email = `e2e_${Date.now()}@example.com`;
    const password = 'TestPass123!';

    // Register user via API
    cy.request('POST', 'http://localhost:5000/api/auth/register', { email, password, location: 'TestCounty' })
      .then((regRes) => {
        expect(regRes.status).to.eq(200);
        const token = regRes.body.token;

        // create a product
        cy.request({
          method: 'POST',
          url: 'http://localhost:5000/api/products',
          headers: { 'x-auth-token': token },
          body: { name: 'TestMaize', category_type: 'Product', unit: 'kg' }
        }).then((prodRes) => {
          expect(prodRes.status).to.eq(200);
          const product = prodRes.body;

          // create a market
          cy.request({
            method: 'POST',
            url: 'http://localhost:5000/api/markets',
            headers: { 'x-auth-token': token },
            body: { name: 'TestMarket', county: 'TestCounty', location: { type: 'Point', coordinates: [36.816, -1.283] } }
          }).then((marketRes) => {
            expect(marketRes.status).to.eq(200);
            const market = marketRes.body;

            // visit prices page and set token/localStorage so PricesPage connects
            cy.visit('/');
            cy.window().then((win) => {
              win.localStorage.setItem('token', token);
              win.localStorage.setItem('user', JSON.stringify({ email }));
            });

            cy.visit('/prices');

            // create a price via API which should trigger the server to emit priceUpdate
            cy.request({
              method: 'POST',
              url: 'http://localhost:5000/api/prices',
              headers: { 'x-auth-token': token },
              body: { product_id: product._id, market_id: market._id, price: 999 }
            }).then((priceRes) => {
              expect(priceRes.status).to.eq(200);

              // wait for the banner to appear
              cy.contains(/New price:/, { timeout: 5000 }).should('be.visible');
              cy.contains('TestMaize').should('be.visible');
              cy.contains('KSh 999').should('be.visible');
            });
          });
        });
      });
  });
});
