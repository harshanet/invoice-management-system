const sinon = require('sinon');
const { expect } = require('chai');

const Resource = require('../models/Resource');
const {
    getResources,
    getResourceById,
    createResource,
    updateResource,
    deleteResource,
} = require('../controllers/resourceController');
const { mockRes } = require('./helpers');

// Every model call is stubbed with Sinon, so these tests exercise the
// controller logic only — no MongoDB connection is required.
describe('Resource Controller', () => {
    afterEach(() => sinon.restore());

    describe('getResources', () => {
        it('returns all resources as JSON', async () => {
            const fake = [{ title: 'Intro to Node' }, { title: 'React Basics' }];
            sinon.stub(Resource, 'find').resolves(fake);
            const res = mockRes();

            await getResources({ query: {} }, res);

            expect(Resource.find.calledOnce).to.be.true;
            expect(res.json.calledWith(fake)).to.be.true;
        });

        it('builds search/type/difficulty/category filters from the query', async () => {
            const findStub = sinon.stub(Resource, 'find').resolves([]);

            await getResources(
                { query: { search: 'node', type: 'video', difficulty: 'beginner', category: 'web' } },
                mockRes(),
            );

            const filter = findStub.firstCall.args[0];
            expect(filter).to.have.property('$or');
            expect(filter.type).to.equal('video');
            expect(filter.difficulty).to.equal('beginner');
            expect(filter.category).to.deep.equal({ $regex: 'web', $options: 'i' });
        });

        it('responds 500 when the database throws', async () => {
            sinon.stub(Resource, 'find').rejects(new Error('db down'));
            const res = mockRes();

            await getResources({ query: {} }, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.firstCall.args[0].message).to.equal('db down');
        });
    });

    describe('getResourceById', () => {
        it('returns the resource when found', async () => {
            const fake = { _id: '1', title: 'Found' };
            sinon.stub(Resource, 'findById').resolves(fake);
            const res = mockRes();

            await getResourceById({ params: { id: '1' } }, res);

            expect(res.json.calledWith(fake)).to.be.true;
        });

        it('responds 404 when the resource is missing', async () => {
            sinon.stub(Resource, 'findById').resolves(null);
            const res = mockRes();

            await getResourceById({ params: { id: 'nope' } }, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.firstCall.args[0].message).to.equal('Resource not found');
        });
    });

    describe('createResource', () => {
        it('responds 400 when title or url is missing', async () => {
            const res = mockRes();
            const create = sinon.stub(Resource, 'create');

            await createResource({ body: { title: 'No URL' }, user: { _id: 'u1' } }, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(create.notCalled).to.be.true;
        });

        it('creates the resource and responds 201', async () => {
            const created = { _id: 'r1', title: 'New', url: 'http://x' };
            sinon.stub(Resource, 'create').resolves(created);
            const res = mockRes();

            await createResource(
                { body: { title: 'New', url: 'http://x' }, user: { _id: 'u1' } },
                res,
            );

            expect(Resource.create.calledOnce).to.be.true;
            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledWith(created)).to.be.true;
        });
    });

    describe('updateResource', () => {
        it('responds 404 when the resource does not exist', async () => {
            sinon.stub(Resource, 'findById').resolves(null);
            const res = mockRes();

            await updateResource({ params: { id: 'x' }, body: {} }, res);

            expect(res.status.calledWith(404)).to.be.true;
        });

        it('saves the changed fields and returns the updated resource', async () => {
            const updated = { _id: 'r1', title: 'Updated' };
            const resource = { title: 'Old', save: sinon.stub().resolves(updated) };
            sinon.stub(Resource, 'findById').resolves(resource);
            const res = mockRes();

            await updateResource({ params: { id: 'r1' }, body: { title: 'Updated' } }, res);

            expect(resource.title).to.equal('Updated');
            expect(resource.save.calledOnce).to.be.true;
            expect(res.json.calledWith(updated)).to.be.true;
        });
    });

    describe('deleteResource', () => {
        it('responds 404 when there is nothing to delete', async () => {
            sinon.stub(Resource, 'findByIdAndDelete').resolves(null);
            const res = mockRes();

            await deleteResource({ params: { id: 'x' } }, res);

            expect(res.status.calledWith(404)).to.be.true;
        });

        it('deletes the resource and confirms with a message', async () => {
            sinon.stub(Resource, 'findByIdAndDelete').resolves({ _id: 'r1' });
            const res = mockRes();

            await deleteResource({ params: { id: 'r1' } }, res);

            expect(res.json.firstCall.args[0].message).to.equal('Resource deleted');
        });
    });
});
