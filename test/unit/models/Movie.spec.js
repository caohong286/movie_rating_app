const Movie = require('./../../../models/Movie.js');
const chai = require('chai');

const expect = chai.expect;

describe('models.Movie', () => {
  it('exists', () => {
    expect(Movie).to.exist;
  });

  describe('Movie', () => {
    it('should be invalid if release_year is not an integer', (done) => {
      const movie = new Movie({
        name: 'test',
        description: 'test',
        release_year: 'test',
        genre: 'test',
      });

      movie.validate((err) => {
        expect(err.errors.release_year).to.exist;
        done();
      });
    });
  });
});
