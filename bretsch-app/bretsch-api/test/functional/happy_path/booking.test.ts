import { Helper } from '../../helper';
import request from 'supertest';
import { Booking } from '../../../src/entity/Booking.entity';

const helper = new Helper();
helper.init();

describe('Tests for the Booking class', () => {
	const helper = new Helper();

	beforeAll(async () => {
		await helper.init();
	});

	afterAll(async () => {
		await helper.shutdown();
    });

    it('createBooking Test', async (done) => {
		await helper.resetDatabase();
		await helper.loadFixtures();

		request(helper.app)
			.post('/api/booking')
			.send({
                startDate: new Date(),
                endDate: new Date(),
                paymentStatus: "payed",
                price: 1234,
                vehicleId: 1,
                userId: 1,

			})
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.expect(200)
			.end(async (err, res) => {
				if (err) throw err;
				const [, booking] = await helper.getRepo(Booking).findAndCount();
				expect(booking).toBe(4);
				expect(res.body.data.paymentStatus).toBe('payed');
                expect(res.body.data.price).toBe(1234);
				done();
			});
    });
    
    it('deleteBooking Test Scary Path for missing param', async (done) => {
		await helper.resetDatabase();
		await helper.loadFixtures();

		request(helper.app)
			.delete('/api/booking/1')
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.expect(200)
			.end(async (err) => {
				if (err) throw err;
				const [, booking] = await helper.getRepo(Booking).findAndCount();
				expect(booking).toBe(2);
				done();
			});
    });

    it('getAllBookings Test Happy Path', async (done) => {
		await helper.resetDatabase();
        await helper.loadFixtures();
        
		request(helper.app)
			.get(`/api/booking`)
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.expect(200)
			.end(async (err, res) => {
				if (err) throw err;
				const [, booking] = await helper.getRepo(Booking).findAndCount();
                expect(booking).toBe(3);
                expect(res.body.data.length).toBe(3);
				expect(res.body.data[0].price).toBe(20);
                expect(res.body.data[1].vehicle.vehicleId).toBe(2);
                expect(res.body.data[2].user.userId).toBe(3);
				done();
			});
    });

    it('getSpecificBooking Test Happy Path', async (done) => {
		await helper.resetDatabase();
		await helper.loadFixtures();

        let booking = new Booking();
        try{
            booking = await helper.getRepo(Booking).findOneOrFail({bookingId:3});
        }catch(error){
            console.log(`The Booking with bookingId: ${booking.bookingId}, could not be found`)
        }
		request(helper.app)
			.get(`/api/booking/${booking.bookingId}`)
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.expect(200)
            .end((err, res) => {
				if (err) throw err;
                expect(res.body.data.bookingId).toBe(3);
                expect(res.body.data.price).toBe(30);
                expect(res.body.data.paymentStatus).toBe('not payed');
				done();
			});
    });

    it('updateBooking Test Happy Path', async (done) => {
		await helper.resetDatabase();
        await helper.loadFixtures();
        
        let booking = new Booking();
        try{
            booking = await helper.getRepo(Booking).findOneOrFail({bookingId:1});
        }catch(error){
            console.log(`The Booking with bookingId: ${booking.bookingId}, could not be found`)
        }

		request(helper.app)
            .patch(`/api/booking/${booking.bookingId}`)
            .send({
				price: 69,
			})
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json')
			.expect(200)
			.end(async (err, res) => {
				if (err) throw err;
				const [, booking] = await helper.getRepo(Booking).findAndCount();
                expect(booking).toBe(3);
				expect(res.body.data.price).toBe(69);
				done();
			});
    });
});