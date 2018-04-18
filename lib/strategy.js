/**
 * Module dependencies.
 */
var util = require('util'),
  OAuth2Strategy = require('passport-oauth2').Strategy,
  InternalOAuthError = require('passport-oauth2').InternalOAuthError,
  Profile = require('./profile')


/**
* `Strategy` constructor.
*
* The Yahoo authentication strategy authenticates requests by delegating to
* Yahoo using the OAuth protocol.
*
* Applications must supply a `verify` callback which accepts a `token`,
* `tokenSecret` and service-specific `profile`, and then calls the `done`
* callback supplying a `user`, which should be set to `false` if the
* credentials are not valid.  If an exception occured, `err` should be set.
*
* Options:
*   - `consumerKey`     identifies client to Yahoo
*   - `consumerSecret`  secret used to establish ownership of the consumer key
*   - `callbackURL`     URL to which Yahoo will redirect the user after obtaining authorization
*
* Examples:
*
*     passport.use(new YahooStrategy({
*         clientID: '123-456-789',
*         clientSecret: 'shhh-its-a-secret'
*         callbackURL: 'https://www.example.net/auth/yahoo/callback'
*       },
*       function(token, tokenSecret, profile, done) {
*         User.findOrCreate(..., function (err, user) {
*           done(err, user);
*         });
*       }
*     ));
*
* @param {Object} options
* @param {Function} verify
* @api public
*/
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://auth.login.yahoo.co.jp/yconnect/v2/authorization';
  options.tokenURL = options.tokenURL || 'https://auth.login.yahoo.co.jp/yconnect/v2/token';
  options.profileURL = options.profileURL || 'https://userinfo.yahooapis.jp/yconnect/v2/attribute';

  OAuth2Strategy.call(this, options, verify);

  this._options = options;
  this.name = 'yahoo';
}

/**
* Inherit from `OAuthStrategy`.
*/
util.inherits(Strategy, OAuth2Strategy);


/**
* Override authenticate:
* inspired from post: http://yahoodevelopers.tumblr.com/post/105969451213/implementing-yahoo-oauth2-authentication
*
*/
Strategy.prototype.authorizationParams = function(req, options) {
  var params = {};

  if (options.display) {
    params.display = options.display;
  }
  if (options.prompt) {
    params.prompt = options.prompt;
  }
  return params;
}


/**
* Retrieve user profile from Yahoo.
* inpired from post: http://yahoodevelopers.tumblr.com/post/105969451213/implementing-yahoo-oauth2-authentication
* other code from : passport-yahoo-token repo
* This function constructs a normalized profile, with the following properties:
*
*   - `id`
*   - `displayName`
*
* @param {String} token
* @param {String} tokenSecret
* @param {Object} params
* @param {Function} done
* @api protected
*/
Strategy.prototype.userProfile = function (accessToken, params, done) {

  this._oauth2._useAuthorizationHeaderForGET = true;
  this._oauth2.get(this._userProfileURL, accessToken, function(err, body, res) {
    var json;

    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }

    try {
      json = JSON.parse(body);
    } catch (ex) {
      return done(new Error('Failed to parse user profile'));
    }

    var profile = Profile.parse(json);
    profile.provider  = 'yahoo';
    profile._raw = body;
    profile._json = json;

    done(null, profile);

  })
}


/**
* Expose `Strategy`.
*/
module.exports = Strategy;
