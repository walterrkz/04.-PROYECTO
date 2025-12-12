describe('E2E: Register, Login and Add Product to Cart', () => {
  beforeEach(() => {
    cy.window().then((win) => win.localStorage.clear());
  });

  it('should register, login and add a product to cart', () => {
    cy.intercept('POST', '**/api/auth/register').as('registerRequest');
    cy.intercept('POST', '**/api/auth/login').as('loginRequest');
    cy.intercept('GET', '**/api/products*').as('getProducts');
    cy.intercept('POST', '**/api/cart/add-product').as('addToCart');

    const timestamp = Date.now();
    const emailTest = `cypress${timestamp}@example.com`;
    const passwordTest = 'Test12345!';

    cy.visit('/register');

    cy.get('#displayName').type(`cypress ${timestamp}`);
    cy.get('#email').type(emailTest);
    cy.get('#password').type(passwordTest);
    cy.get('#repeatPassword').type(passwordTest);

    cy.get('button[type="submit"]').click();

    cy.wait('@registerRequest', { timeout: 10000 }).then((i) => {
      expect(i.response).to.not.be.undefined;
      expect(i.response!.statusCode).to.equal(201);
    });

    cy.contains('Usuario creado con éxito', { timeout: 8000 }).should(
      'be.visible'
    );

    cy.visit('/login');

    cy.get('input[type="email"]').type(emailTest);
    cy.get('input[type="password"]').type(passwordTest);

    cy.get('button[type="submit"]').click();

    cy.wait('@loginRequest', { timeout: 10000 }).then((i) => {
      expect(i.response).to.not.be.undefined;
      expect(i.response!.statusCode).to.equal(200);
    });

    cy.url({ timeout: 10000 }).should('not.include', '/login');

    cy.window().then((win) => {
      const token = win.localStorage.getItem('token');
      expect(token).to.not.be.null;
    });

    cy.visit('/products');

    cy.wait('@getProducts', { timeout: 10000 });

    cy.get('[data-cy="product-card"]', { timeout: 10000 })
      .should('have.length.at.least', 1)
      .first()
      .as('firstProduct');

    cy.get('@firstProduct').find('[data-cy="add-to-cart-btn"]').click();

    cy.wait('@addToCart', { timeout: 10000 }).then((i) => {
      expect(i.response).not.to.be.undefined;
      expect(i.response!.statusCode).to.equal(200);
    });
  });
});
