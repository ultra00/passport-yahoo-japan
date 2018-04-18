/* global describe, it, before, expect */
/* jshint expr: true */

var YahooStrategy = require('../lib/strategy');

describe('Strategy#userProfile', function() {

  describe('fetched from default endpoint', function() {

    var strategy = new YahooStrategy({
      clientID: 'ABC123',
      clientSecret: 'secret',
    }, function() {})

    strategy._oauth2.get = function(url, accessToken, callback) {
      if(url !== 'https://userinfo.yahooapis.jp/yconnect/v2/attribute' ) { return callback(new Error('incorrect url argument'))}
      if (accessToken != 'token') { return callback(new Error('incorrect token argument')); }

      var body = '{"sub":"FQBSQOIDGW5PV4NHAAUY7BWAMU","name": "矢風太郎","given_name":"太郎","given_name#ja-Kana-JP": "タロウ","given_name#ja-Hani-JP": "太郎","family_name": "矢風","family_name#ja-Kana-JP": "ヤフウ","family_name#ja-Hani-JP": "矢風","gender": "male","zoneinfo": "Asia/Tokyo","locale": "ja-JP","birthdate": "1986","nickname": "やふうたろう","picture": "https://dummy.img.yahoo.co.jp/example.png","email": "yconnect@example.com","email_verified": "true","address": {"country": "JP","postal_code": "1028282","region": "東京都","locality": "千代田区","formatted": "東京都千代田区"}}';
      callback(null, body, undefined);
    }

    var profile;

    before(function(done) {
      strategy.userProfile('token', function(err, p) {
        if(err) { return done(err)}
        profile = p;
        done();
      })
    })

    it('should parse profile', function() {
      expect(profile.provider).to.equal('yahoo');
      expect(profile.id).to.equal('FQBSQOIDGW5PV4NHAAUY7BWAMU');
      expect(profile.displayName).to.equal('矢風太郎');
      expect(profile.name.givenName).to.equal('太郎');
      expect(profile.name.familyName).to.equal('矢風');
      expect(profile.name['given_name#ja-Kana-JP']).to.equal('タロウ');
      expect(profile.name['given_name#ja-Hani-JP']).to.equal('太郎');
      expect(profile.name['family_name#ja-Kana-JP']).to.equal('矢風');
      expect(profile.name['family_name#ja-Hani-JP']).to.equal('ヤフウ');
      expect(profile.gender).to.equal('male');
      expect(profile.birtyday).to.equal('1986');
      expect(profile.photos).to.have.length(1);
      expect(profile.photos[0].value).to.equal('http://www.facebook.com/jaredhanson');
      expect(profile.emails).to.have.length(1);
      expect(profile.emails[0].value).to.equal('jaredhanson@example.com');
      expect(profile.address.country).to.equal('JP');
      expect(profile.address.postalCode).to.equal('1028282');
      expect(profile.address.locality).to.equal('千代田区');
      expect(profile.address.region).to.equal('東京都');
      expect(profile.address.formatted).to.equal('東京都千代田区');
    })

    it('should set raw property', function() {
      expect(profile._raw).to.be.a('string');
    });

    it('should set json property', function() {
      expect(profile._json).to.be.an('object');
    });


  })

})