const sinon = require('sinon');
const { expect } = require('chai');

const Category = require('../models/Category');
const {
    createCategory,
    getCategories,
    deleteCategory,
} = require('../controllers/categoryController');
const { mockRes } = require('./helpers');

describe('Category Controller', () => {
    afterEach(() => sinon.restore());

    describe('createCategory', () => {
        it('responds 400 when the category already exists', async () => {
            sinon.stub(Category, 'findOne').resolves({ name: 'Web' });
            const create = sinon.stub(Category, 'create');
            const res = mockRes();

            await createCategory({ body: { name: 'Web' } }, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(create.notCalled).to.be.true;
        });

        it('creates a new category and responds 201', async () => {
            const created = { _id: 'c1', name: 'Web' };
            sinon.stub(Category, 'findOne').resolves(null);
            sinon.stub(Category, 'create').resolves(created);
            const res = mockRes();

            await createCategory({ body: { name: 'Web', description: 'Web dev' } }, res);

            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledWith(created)).to.be.true;
        });
    });

    describe('getCategories', () => {
        it('returns all categories as JSON', async () => {
            const fake = [{ name: 'Web' }, { name: 'Data' }];
            sinon.stub(Category, 'find').resolves(fake);
            const res = mockRes();

            await getCategories({}, res);

            expect(res.json.calledWith(fake)).to.be.true;
        });

        it('responds 500 on a database error', async () => {
            sinon.stub(Category, 'find').rejects(new Error('boom'));
            const res = mockRes();

            await getCategories({}, res);

            expect(res.status.calledWith(500)).to.be.true;
        });
    });

    describe('deleteCategory', () => {
        it('responds 404 when the category is not found', async () => {
            sinon.stub(Category, 'findById').resolves(null);
            const res = mockRes();

            await deleteCategory({ params: { id: 'x' } }, res);

            expect(res.status.calledWith(404)).to.be.true;
        });

        it('deletes the category and confirms with a message', async () => {
            const category = { deleteOne: sinon.stub().resolves() };
            sinon.stub(Category, 'findById').resolves(category);
            const res = mockRes();

            await deleteCategory({ params: { id: 'c1' } }, res);

            expect(category.deleteOne.calledOnce).to.be.true;
            expect(res.json.firstCall.args[0].message).to.equal('Category deleted');
        });
    });
});
