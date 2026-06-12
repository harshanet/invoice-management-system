const sinon = require('sinon');
const { expect } = require('chai');

const Bookmark = require('../models/Bookmark');
const {
    getBookmarks,
    addBookmark,
    removeBookmark,
} = require('../controllers/bookmarkController');
const { mockRes } = require('./helpers');

const reqUser = { _id: 'user1' };

describe('Bookmark Controller', () => {
    afterEach(() => sinon.restore());

    describe('getBookmarks', () => {
        it("returns the user's bookmarks with the resource populated", async () => {
            const fake = [{ _id: 'b1', resourceId: { title: 'Saved' } }];
            // find(...).populate('resourceId') -> stub find to return an object
            // exposing a populate() that resolves the bookmark list.
            sinon.stub(Bookmark, 'find').returns({ populate: sinon.stub().resolves(fake) });
            const res = mockRes();

            await getBookmarks({ user: reqUser }, res);

            expect(res.json.calledWith(fake)).to.be.true;
        });
    });

    describe('addBookmark', () => {
        it('responds 400 when resourceId is missing', async () => {
            const res = mockRes();

            await addBookmark({ body: {}, user: reqUser }, res);

            expect(res.status.calledWith(400)).to.be.true;
        });

        it('responds 409 when the bookmark already exists', async () => {
            sinon.stub(Bookmark, 'findOne').resolves({ _id: 'b1' });
            const res = mockRes();

            await addBookmark({ body: { resourceId: 'r1' }, user: reqUser }, res);

            expect(res.status.calledWith(409)).to.be.true;
        });

        it('creates the bookmark and responds 201', async () => {
            const created = { _id: 'b1', resourceId: 'r1' };
            sinon.stub(Bookmark, 'findOne').resolves(null);
            sinon.stub(Bookmark, 'create').resolves(created);
            const res = mockRes();

            await addBookmark({ body: { resourceId: 'r1' }, user: reqUser }, res);

            expect(res.status.calledWith(201)).to.be.true;
            expect(res.json.calledWith(created)).to.be.true;
        });
    });

    describe('removeBookmark', () => {
        it('responds 404 when there is no matching bookmark', async () => {
            sinon.stub(Bookmark, 'findOneAndDelete').resolves(null);
            const res = mockRes();

            await removeBookmark({ params: { resourceId: 'r1' }, user: reqUser }, res);

            expect(res.status.calledWith(404)).to.be.true;
        });

        it('removes the bookmark and confirms with a message', async () => {
            sinon.stub(Bookmark, 'findOneAndDelete').resolves({ _id: 'b1' });
            const res = mockRes();

            await removeBookmark({ params: { resourceId: 'r1' }, user: reqUser }, res);

            expect(res.json.firstCall.args[0].message).to.equal('Bookmark removed');
        });
    });
});
