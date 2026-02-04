describe('Prueba de Flujo de Login (E2E)', () => {

  beforeEach(() => {
    cy.visit('http://localhost:4200/login'); 
  });

  it('Debe mostrar el formulario de login correctamente', () => {
    cy.contains('h2', 'Inicio de Sesión').should('be.visible');
    cy.get('button[type="submit"]').should('contain.text', 'Iniciar Sesión');
  });

  it('Debe loguearse exitosamente y redirigir al inicio', () => {
    // usuario existente en BD
    const usuarioValido = {
      email: 'alumno@frro.utn.edu.ar', 
      password: 'password123'
    };

    cy.get('input#email').type(usuarioValido.email);
    cy.get('input#password').type(usuarioValido.password);
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/inicio');
  });

  it('Debe mostrar alerta con credenciales inválidas', () => {
    cy.on('window:alert', (str) => {
      expect(str).to.equal('Email o contraseña incorrecta');
    });

    cy.get('input#email').type('usuario@falso.com');
    cy.get('input#password').type('claveincorrecta');
    cy.get('button[type="submit"]').click();
  });

});