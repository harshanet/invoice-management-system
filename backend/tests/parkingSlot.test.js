const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const app = require('../server');
const ParkingSlot = require('../models/ParkingSlot');
const User = require('../models/User');

const { expect } = chai;
chai.use(chaiHttp);

describe('ParkingSlot Routes', () => {
    let findStub, findOneStub, createStub, findByIdStub, deleteOneStub, userFindByIdStub, jwtVerifyStub;
    const token = 'dummy_token';

    beforeEach(() => {
        // Stub JWT verification
        jwtVerifyStub = sinon.stub(jwt, 'verify').returns({ id: 'dummy_user_id' });

        // Stub User database lookup for authentication middleware
        userFindByIdStub = sinon.stub(User, 'findById').returns({
            select: sinon.stub().resolves({
                _id: 'dummy_user_id',
                name: 'Admin User',
                email: 'admin@example.com',
                role: 'admin'
            })
        });

        // Stub ParkingSlot queries
        findStub = sinon.stub(ParkingSlot, 'find');
        findOneStub = sinon.stub(ParkingSlot, 'findOne');
        createStub = sinon.stub(ParkingSlot, 'create');
        findByIdStub = sinon.stub(ParkingSlot, 'findById');
        deleteOneStub = sinon.stub(ParkingSlot, 'deleteOne');
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('GET /api/slots/available', () => {
        it('should return all available slots', (done) => {
            const mockSlots = [
                { _id: 'slot1', slotNumber: 'Slot A-101', location: 'Floor 1', pricePerHour: 5, isAvailable: true }
            ];
            findStub.resolves(mockSlots);

            chai.request(app)
                .get('/api/slots/available')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body[0].slotNumber).to.equal('Slot A-101');
                    done();
                });
        });
    });

    describe('GET /api/slots', () => {
        it('should return all slots for authenticated users', (done) => {
            const mockSlots = [
                { _id: 'slot1', slotNumber: 'Slot A-101', location: 'Floor 1', pricePerHour: 5, isAvailable: true },
                { _id: 'slot2', slotNumber: 'Slot A-102', location: 'Floor 1', pricePerHour: 5, isAvailable: false }
            ];
            findStub.resolves(mockSlots);

            chai.request(app)
                .get('/api/slots')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body.length).to.equal(2);
                    done();
                });
        });
    });

    describe('POST /api/slots', () => {
        it('should create a new parking slot as an admin', (done) => {
            const newSlotData = { slotNumber: 'Slot B-201', location: 'Floor 2', pricePerHour: 6 };
            const createdSlot = { _id: 'slot3', ...newSlotData, isAvailable: true };

            findOneStub.resolves(null); // Slot doesn't exist yet
            createStub.resolves(createdSlot);

            chai.request(app)
                .post('/api/slots')
                .set('Authorization', `Bearer ${token}`)
                .send(newSlotData)
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body.slotNumber).to.equal('Slot B-201');
                    done();
                });
        });

        it('should block slot creation if user is not admin', (done) => {
            // Restore User stub and create a user stub that returns role: 'user'
            userFindByIdStub.restore();
            userFindByIdStub = sinon.stub(User, 'findById').returns({
                select: sinon.stub().resolves({
                    _id: 'dummy_user_id',
                    name: 'Regular User',
                    email: 'user@example.com',
                    role: 'user'
                })
            });

            chai.request(app)
                .post('/api/slots')
                .set('Authorization', `Bearer ${token}`)
                .send({ slotNumber: 'Slot B-201', location: 'Floor 2', pricePerHour: 6 })
                .end((err, res) => {
                    expect(res).to.have.status(403);
                    expect(res.body.message).to.equal('Not authorized as an admin');
                    done();
                });
        });
    });

    describe('PUT /api/slots/:id', () => {
        it('should update parking slot details as admin', (done) => {
            const mockSlot = {
                _id: 'slot1',
                slotNumber: 'Slot A-101',
                location: 'Floor 1',
                pricePerHour: 5,
                isAvailable: true,
                save: sinon.stub().resolves({
                    _id: 'slot1',
                    slotNumber: 'Slot A-101-Updated',
                    location: 'Floor 1',
                    pricePerHour: 8,
                    isAvailable: true
                })
            };

            findByIdStub.resolves(mockSlot);

            chai.request(app)
                .put('/api/slots/slot1')
                .set('Authorization', `Bearer ${token}`)
                .send({ slotNumber: 'Slot A-101-Updated', pricePerHour: 8 })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.slotNumber).to.equal('Slot A-101-Updated');
                    expect(res.body.pricePerHour).to.equal(8);
                    done();
                });
        });
    });

    describe('DELETE /api/slots/:id', () => {
        it('should delete a parking slot as admin', (done) => {
            const mockSlot = { _id: 'slot1', slotNumber: 'Slot A-101' };
            findByIdStub.resolves(mockSlot);
            deleteOneStub.resolves({ deletedCount: 1 });

            chai.request(app)
                .delete('/api/slots/slot1')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.message).to.equal('Slot removed');
                    done();
                });
        });
    });
});
