const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');
const app = require('../server');
const Booking = require('../models/Booking');
const ParkingSlot = require('../models/ParkingSlot');
const User = require('../models/User');

const { expect } = chai;
chai.use(chaiHttp);

describe('Booking Routes', () => {
    let findStub, createStub, findByIdStub, deleteOneStub, userFindByIdStub, jwtVerifyStub, slotFindByIdStub;
    const token = 'dummy_token';

    beforeEach(() => {
        // Stub JWT verification
        jwtVerifyStub = sinon.stub(jwt, 'verify').returns({ id: 'dummy_user_id' });

        // Stub User database lookup for authentication middleware
        userFindByIdStub = sinon.stub(User, 'findById').returns({
            select: sinon.stub().resolves({
                _id: 'dummy_user_id',
                id: 'dummy_user_id',
                name: 'Regular User',
                email: 'user@example.com',
                role: 'user'
            })
        });

        // Stub Booking queries
        findStub = sinon.stub(Booking, 'find');
        createStub = sinon.stub(Booking, 'create');
        findByIdStub = sinon.stub(Booking, 'findById');
        deleteOneStub = sinon.stub(Booking, 'deleteOne');

        // Stub ParkingSlot queries
        slotFindByIdStub = sinon.stub(ParkingSlot, 'findById');
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('POST /api/bookings', () => {
        it('should create a new booking and mark the slot as unavailable', (done) => {
            const mockSlot = {
                _id: 'slot1',
                slotNumber: 'Slot A-101',
                isAvailable: true,
                save: sinon.stub().resolves()
            };
            const mockBooking = {
                _id: 'booking1',
                user: 'dummy_user_id',
                parkingSlot: 'slot1',
                startTime: new Date('2026-06-06T10:00:00Z'),
                endTime: new Date('2026-06-06T12:00:00Z')
            };

            slotFindByIdStub.resolves(mockSlot);
            createStub.resolves(mockBooking);

            chai.request(app)
                .post('/api/bookings')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    parkingSlotId: 'slot1',
                    startTime: '2026-06-06T10:00:00Z',
                    endTime: '2026-06-06T12:00:00Z'
                })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.be.an('object');
                    expect(res.body.parkingSlot).to.equal('slot1');
                    expect(mockSlot.isAvailable).to.be.false;
                    expect(mockSlot.save.calledOnce).to.be.true;
                    done();
                });
        });

        it('should return 404 if slot not found', (done) => {
            slotFindByIdStub.resolves(null);

            chai.request(app)
                .post('/api/bookings')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    parkingSlotId: 'nonexistent',
                    startTime: '2026-06-06T10:00:00Z',
                    endTime: '2026-06-06T12:00:00Z'
                })
                .end((err, res) => {
                    expect(res).to.have.status(404);
                    expect(res.body.message).to.equal('Parking slot not found');
                    done();
                });
        });

        it('should return 400 if slot is already occupied', (done) => {
            const mockSlot = {
                _id: 'slot1',
                slotNumber: 'Slot A-101',
                isAvailable: false
            };

            slotFindByIdStub.resolves(mockSlot);

            chai.request(app)
                .post('/api/bookings')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    parkingSlotId: 'slot1',
                    startTime: '2026-06-06T10:00:00Z',
                    endTime: '2026-06-06T12:00:00Z'
                })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body.message).to.equal('Parking slot is already occupied');
                    done();
                });
        });
    });

    describe('GET /api/bookings', () => {
        it('should return active bookings for authenticated user', (done) => {
            const mockBookings = [
                {
                    _id: 'booking1',
                    user: 'dummy_user_id',
                    parkingSlot: { _id: 'slot1', slotNumber: 'Slot A-101' },
                    startTime: new Date('2026-06-06T10:00:00Z'),
                    endTime: new Date('2026-06-06T12:00:00Z')
                }
            ];

            const populateStub = sinon.stub().resolves(mockBookings);
            findStub.returns({ populate: populateStub });

            chai.request(app)
                .get('/api/bookings')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body.length).to.equal(1);
                    expect(res.body[0].parkingSlot.slotNumber).to.equal('Slot A-101');
                    expect(findStub.calledWith({ user: 'dummy_user_id' })).to.be.true;
                    done();
                });
        });
    });

    describe('PUT /api/bookings/:id', () => {
        it('should update booking times if user owns the booking', (done) => {
            const mockBooking = {
                _id: 'booking1',
                user: 'dummy_user_id',
                parkingSlot: 'slot1',
                startTime: new Date('2026-06-06T10:00:00Z'),
                endTime: new Date('2026-06-06T12:00:00Z'),
                save: sinon.stub().resolves({
                    _id: 'booking1',
                    user: 'dummy_user_id',
                    parkingSlot: 'slot1',
                    startTime: new Date('2026-06-06T11:00:00Z'),
                    endTime: new Date('2026-06-06T13:00:00Z')
                })
            };

            findByIdStub.resolves(mockBooking);

            chai.request(app)
                .put('/api/bookings/booking1')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    startTime: '2026-06-06T11:00:00Z',
                    endTime: '2026-06-06T13:00:00Z'
                })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.startTime).to.exist;
                    expect(mockBooking.save.calledOnce).to.be.true;
                    done();
                });
        });

        it('should return 401 if user does not own the booking', (done) => {
            const mockBooking = {
                _id: 'booking1',
                user: 'another_user_id',
                parkingSlot: 'slot1'
            };

            findByIdStub.resolves(mockBooking);

            chai.request(app)
                .put('/api/bookings/booking1')
                .set('Authorization', `Bearer ${token}`)
                .send({
                    startTime: '2026-06-06T11:00:00Z'
                })
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body.message).to.equal('User not authorized to update this booking');
                    done();
                });
        });
    });

    describe('DELETE /api/bookings/:id', () => {
        it('should cancel the booking and release the parking slot', (done) => {
            const mockSlot = {
                _id: 'slot1',
                slotNumber: 'Slot A-101',
                isAvailable: false,
                save: sinon.stub().resolves()
            };
            const mockBooking = {
                _id: 'booking1',
                user: 'dummy_user_id',
                parkingSlot: 'slot1'
            };

            findByIdStub.resolves(mockBooking);
            slotFindByIdStub.resolves(mockSlot);
            deleteOneStub.resolves({ deletedCount: 1 });

            chai.request(app)
                .delete('/api/bookings/booking1')
                .set('Authorization', `Bearer ${token}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.message).to.equal('Booking cancelled and slot released');
                    expect(mockSlot.isAvailable).to.be.true;
                    expect(mockSlot.save.calledOnce).to.be.true;
                    expect(deleteOneStub.calledWith({ _id: 'booking1' })).to.be.true;
                    done();
                });
        });
    });
});
