/* eslint-env mocha */
/* global describe, it, before, after */

// Polyfill global Promise if necessary
import {polyfill} from 'es6-promise';
if (global.Promise === undefined) {
  polyfill();
}

import expect from 'expect.js';
import moxios from 'moxios';
import sinon from 'sinon';
import hibp from '../lib/hibp';

// Test data
const ERR_MSG = 'Set sail for fail!';
const INVALID_HEADER = 'baz';
const DOMAIN = 'foo.bar';
const ACCOUNT_BREACHED = 'foo';
const ACCOUNT_CLEAN = 'bar';
const BREACH_FOUND = 'foo';
const BREACH_NOT_FOUND = 'bar';
const EMAIL_PASTED = 'foo@bar.com';
const EMAIL_CLEAN = 'baz@qux.com';
const EMAIL_INVALID = 'foobar';
const RESPONSE_OBJ = {};
const RESPONSE_ARY = [];
const RESPONSE_CLEAN = null;
const STATUS_200 = 200;
const STATUS_400 = 400;
const STATUS_403 = 403;
const STATUS_404 = 404;

describe('hibp', () => {
  before(() => {
    moxios.install(hibp.axios);

    // Configure mocked API calls and results
    moxios.stubRequest(
        new RegExp(`/breachedaccount/${ACCOUNT_BREACHED}\\??`), {
          status: STATUS_200,
          response: RESPONSE_OBJ
        });
    moxios.stubRequest(
        new RegExp(`/breachedaccount/${ACCOUNT_CLEAN}\\??`), {
          status: STATUS_404
        });
    moxios.stubRequest(
        new RegExp(`/breachedaccount/${INVALID_HEADER}\\??`), {
          status: STATUS_403
        });
    moxios.stubRequest(
        new RegExp('/breaches\\??'), {
          status: STATUS_200,
          response: RESPONSE_ARY
        });
    moxios.stubRequest(
        new RegExp(`/breach/${BREACH_FOUND}`), {
          status: STATUS_200,
          response: RESPONSE_OBJ
        });
    moxios.stubRequest(
        new RegExp(`/breach/${BREACH_NOT_FOUND}`), {
          status: STATUS_404
        });
    moxios.stubRequest(
        new RegExp('/dataclasses'), {
          status: STATUS_200,
          response: RESPONSE_ARY
        });
    moxios.stubRequest(
        new RegExp(`/pasteaccount/${EMAIL_PASTED}`), {
          status: STATUS_200,
          response: RESPONSE_ARY
        });
    moxios.stubRequest(
        new RegExp(`/pasteaccount/${EMAIL_CLEAN}`), {
          status: STATUS_404
        });
    moxios.stubRequest(
        new RegExp(`/pasteaccount/${EMAIL_INVALID}`), {
          status: STATUS_400
        });
  });

  after(() => {
    moxios.uninstall(hibp.axios);
  });

  describe('fetchFromApi', () => {
    let failboat;

    before(() => {
      failboat = hibp.axios.interceptors.request.use(() => {
        throw new Error(ERR_MSG);
      });
    });

    after(() => {
      hibp.axios.interceptors.request.eject(failboat);
    });

    it('should re-throw request setup errors', (done) => {
      const handler = sinon.spy();
      hibp.dataClasses()
          .then(handler)
          .catch((err) => {
            expect(handler.called).to.be(false);
            expect(err).to.be.an(Error);
            expect(err.message).to.match(new RegExp(`^${ERR_MSG}$`));
            done();
          })
          .catch(done);
    });
  });

  describe('breachedAccount (breached account, no parameters)', () => {
    it('should return a Promise', (done) => {
      let query = hibp.breachedAccount(ACCOUNT_BREACHED);
      expect(query).to.be.a(Promise);
      expect(query).to.have.property('then');
      done();
    });

    it('should resolve with an object', (done) => {
      const handler = sinon.spy();
      hibp.breachedAccount(ACCOUNT_BREACHED)
          .then(handler)
          .then(() => {
            expect(handler.calledOnce).to.be(true);
            expect(handler.getCall(0).args[0]).to.be(RESPONSE_OBJ);
            done();
          })
          .catch(done);
    });
  });

  describe('breachedAccount (breached account, with truncateResults)', () => {
    it('should return a Promise', (done) => {
      let truncatedQuery = hibp.breachedAccount(ACCOUNT_BREACHED, true);
      expect(truncatedQuery).to.be.a(Promise);
      expect(truncatedQuery).to.have.property('then');
      done();
    });

    it('should resolve with an object', (done) => {
      const handler = sinon.spy();
      hibp.breachedAccount(ACCOUNT_BREACHED, true)
          .then(handler)
          .then(() => {
            expect(handler.calledOnce).to.be(true);
            expect(handler.getCall(0).args[0]).to.be(RESPONSE_OBJ);
            done();
          })
          .catch(done);
    });
  });

  describe('breachedAccount (breached account, with domain)', () => {
    it('should return a Promise', (done) => {
      let filteredQuery = hibp.breachedAccount(ACCOUNT_BREACHED, DOMAIN);
      expect(filteredQuery).to.be.a(Promise);
      expect(filteredQuery).to.have.property('then');
      done();
    });

    it('should resolve with an object', (done) => {
      const handler = sinon.spy();
      hibp.breachedAccount(ACCOUNT_BREACHED, DOMAIN)
          .then(handler)
          .then(() => {
            expect(handler.calledOnce).to.be(true);
            expect(handler.getCall(0).args[0]).to.be(RESPONSE_OBJ);
            done();
          })
          .catch(done);
    });
  });

  describe('breachedAccount (breached account, with domain and ' +
      'truncateResults)', () => {
    it('should return a Promise', (done) => {
      let comboQuery = hibp.breachedAccount(ACCOUNT_BREACHED, DOMAIN, true);
      expect(comboQuery).to.be.a(Promise);
      expect(comboQuery).to.have.property('then');
      done();
    });

    it('should resolve with an object', (done) => {
      const handler = sinon.spy();
      hibp.breachedAccount(ACCOUNT_BREACHED, DOMAIN, true)
          .then(handler)
          .then(() => {
            expect(handler.calledOnce).to.be(true);
            expect(handler.getCall(0).args[0]).to.be(RESPONSE_OBJ);
            done();
          })
          .catch(done);
    });
  });

  describe('breachedAccount (clean account, no parameters)', () => {
    it('should return a Promise', (done) => {
      let query = hibp.breachedAccount(ACCOUNT_CLEAN);
      expect(query).to.be.a(Promise);
      expect(query).to.have.property('then');
      done();
    });

    it('should resolve with null', (done) => {
      const handler = sinon.spy();
      hibp.breachedAccount(ACCOUNT_CLEAN)
          .then(handler)
          .then(() => {
            expect(handler.calledOnce).to.be(true);
            expect(handler.getCall(0).args[0]).to.be(RESPONSE_CLEAN);
            done();
          })
          .catch(done);
    });
  });

  describe('breachedAccount (clean account, with truncateResults)', () => {
    it('should return a Promise', (done) => {
      let truncatedQuery = hibp.breachedAccount(ACCOUNT_CLEAN, true);
      expect(truncatedQuery).to.be.a(Promise);
      expect(truncatedQuery).to.have.property('then');
      done();
    });

    it('should resolve with null', (done) => {
      const handler = sinon.spy();
      hibp.breachedAccount(ACCOUNT_CLEAN, true)
          .then(handler)
          .then(() => {
            expect(handler.calledOnce).to.be(true);
            expect(handler.getCall(0).args[0]).to.be(RESPONSE_CLEAN);
            done();
          })
          .catch(done);
    });
  });

  describe('breachedAccount (clean account, with domain)', () => {
    it('should return a Promise', (done) => {
      let filteredQuery = hibp.breachedAccount(ACCOUNT_CLEAN, DOMAIN);
      expect(filteredQuery).to.be.a(Promise);
      expect(filteredQuery).to.have.property('then');
      done();
    });

    it('should resolve with null', (done) => {
      const handler = sinon.spy();
      hibp.breachedAccount(ACCOUNT_CLEAN, DOMAIN)
          .then(handler)
          .then(() => {
            expect(handler.calledOnce).to.be(true);
            expect(handler.getCall(0).args[0]).to.be(RESPONSE_CLEAN);
            done();
          })
          .catch(done);
    });
  });

  describe('breachedAccount (clean account, with domain and truncateResults)',
      () => {
        it('should return a Promise', (done) => {
          let comboQuery = hibp.breachedAccount(ACCOUNT_CLEAN, DOMAIN, true);
          expect(comboQuery).to.be.a(Promise);
          expect(comboQuery).to.have.property('then');
          done();
        });

        it('should resolve with null', (done) => {
          const handler = sinon.spy();
          hibp.breachedAccount(ACCOUNT_CLEAN, DOMAIN, true)
              .then(handler)
              .then(() => {
                expect(handler.calledOnce).to.be(true);
                expect(handler.getCall(0).args[0]).to.be(RESPONSE_CLEAN);
                done();
              })
              .catch(done);
        });
      });

  describe('breachedAccount (invalid request header)', () => {
    it('should return a Promise', (done) => {
      let invalidQuery = hibp.breachedAccount(INVALID_HEADER);
      expect(invalidQuery).to.be.a(Promise);
      expect(invalidQuery).to.have.property('then');
      done();
    });

    it('should throw an Error starting with "Forbidden"', (done) => {
      const handler = sinon.spy();
      const errorHandler = sinon.spy();
      hibp.breachedAccount(INVALID_HEADER)
          .then(handler)
          .catch(errorHandler)
          .then(() => {
            expect(handler.called).to.be(false);
            expect(errorHandler.calledOnce).to.be(true);
            const err = errorHandler.getCall(0).args[0];
            expect(err.message).to.match(/^Forbidden/);
            done();
          })
          .catch(done);
    });
  });

  describe('breaches (no parameters)', () => {
    it('should return a Promise', (done) => {
      let query = hibp.breaches();
      expect(query).to.be.a(Promise);
      expect(query).to.have.property('then');
      done();
    });

    it('should resolve with an array', (done) => {
      const handler = sinon.spy();
      hibp.breaches()
          .then(handler)
          .then(() => {
            expect(handler.calledOnce).to.be(true);
            expect(handler.getCall(0).args[0]).to.be(RESPONSE_ARY);
            done();
          })
          .catch(done);
    });
  });

  describe('breaches (with domain)', () => {
    it('should return a Promise', (done) => {
      let query = hibp.breaches(DOMAIN);
      expect(query).to.be.a(Promise);
      expect(query).to.have.property('then');
      done();
    });

    it('should resolve with an array', (done) => {
      const handler = sinon.spy();
      hibp.breaches(DOMAIN)
          .then(handler)
          .then(() => {
            expect(handler.calledOnce).to.be(true);
            expect(handler.getCall(0).args[0]).to.be(RESPONSE_ARY);
            done();
          })
          .catch(done);
    });
  });

  describe('breach (found)', () => {
    it('should return a Promise', (done) => {
      let query = hibp.breach(BREACH_FOUND);
      expect(query).to.be.a(Promise);
      expect(query).to.have.property('then');
      done();
    });

    it('should resolve with an object', (done) => {
      const handler = sinon.spy();
      hibp.breach(BREACH_FOUND)
          .then(handler)
          .then(() => {
            expect(handler.calledOnce).to.be(true);
            expect(handler.getCall(0).args[0]).to.be(RESPONSE_OBJ);
            done();
          })
          .catch(done);
    });
  });

  describe('breach (not found)', () => {
    it('should return a Promise', (done) => {
      let query = hibp.breach(BREACH_NOT_FOUND);
      expect(query).to.be.a(Promise);
      expect(query).to.have.property('then');
      done();
    });

    it('should resolve with null', (done) => {
      const handler = sinon.spy();
      hibp.breach(BREACH_NOT_FOUND)
          .then(handler)
          .then(() => {
            expect(handler.calledOnce).to.be(true);
            expect(handler.getCall(0).args[0]).to.be(RESPONSE_CLEAN);
            done();
          })
          .catch(done);
    });
  });

  describe('dataClasses', () => {
    it('should return a Promise', (done) => {
      let query = hibp.dataClasses();
      expect(query).to.be.a(Promise);
      expect(query).to.have.property('then');
      done();
    });

    it('should resolve with an array', (done) => {
      const handler = sinon.spy();
      hibp.dataClasses()
          .then(handler)
          .then(() => {
            expect(handler.calledOnce).to.be(true);
            expect(handler.getCall(0).args[0]).to.be(RESPONSE_ARY);
            done();
          })
          .catch(done);
    });
  });

  describe('pasteAccount (pasted email)', () => {
    it('should return a Promise', (done) => {
      let query = hibp.pasteAccount(EMAIL_PASTED);
      expect(query).to.be.a(Promise);
      expect(query).to.have.property('then');
      done();
    });

    it('should resolve with an array', (done) => {
      const handler = sinon.spy();
      hibp.pasteAccount(EMAIL_PASTED)
          .then(handler)
          .then(() => {
            expect(handler.calledOnce).to.be(true);
            expect(handler.getCall(0).args[0]).to.be(RESPONSE_ARY);
            done();
          })
          .catch(done);
    });
  });

  describe('pasteAccount (clean email)', () => {
    it('should return a Promise', (done) => {
      let query = hibp.pasteAccount(EMAIL_CLEAN);
      expect(query).to.be.a(Promise);
      expect(query).to.have.property('then');
      done();
    });

    it('should resolve with null', (done) => {
      const handler = sinon.spy();
      hibp.pasteAccount(EMAIL_CLEAN)
          .then(handler)
          .then(() => {
            expect(handler.calledOnce).to.be(true);
            expect(handler.getCall(0).args[0]).to.be(RESPONSE_CLEAN);
            done();
          })
          .catch(done);
    });
  });

  describe('pasteAccount (invalid email)', () => {
    it('should return a Promise', (done) => {
      let query = hibp.pasteAccount(EMAIL_INVALID);
      expect(query).to.be.a(Promise);
      expect(query).to.have.property('then');
      done();
    });

    it('should throw an Error starting with "Bad request"', (done) => {
      const handler = sinon.spy();
      const errorHandler = sinon.spy();
      hibp.pasteAccount(EMAIL_INVALID)
          .then(handler)
          .catch(errorHandler)
          .then(() => {
            expect(handler.called).to.be(false);
            expect(errorHandler.calledOnce).to.be(true);
            const err = errorHandler.getCall(0).args[0];
            expect(err.message).to.match(/^Bad request/);
            done();
          })
          .catch(done);
    });
  });
});
