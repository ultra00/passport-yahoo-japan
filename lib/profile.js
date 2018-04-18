/**
 * Parse profile.
 *
 * @param {object|string} json
 * @return {object}
 * @access public
 */
exports.parse = function(json) {
  if ('string' == typeof json) {
    json = JSON.parse(json);
  }

  var profile = {};
  profile.id = json.sub; // scope openid required
  profile.displayName = json.name;
  profile.name = {
    familyName: json.family_name,
    'family_name#ja-Kana-JP': json['family_name#ja-Kana-JP'],
    'family_name#ja-Hani-JP': json['family_name#ja-Hani-JP'],
    givenName: json.given_name,
    'given_name#ja-Kana-JP': json['given_name#ja-Kana-JP'],
    'given_name#ja-Hani-JP': json['given_name#ja-Hani-JP']
  };

  profile.gender = json.gender;
  profile.birtyday = json.birthdate;
  profile.locale = json.locale;
  if (json.picture) {
    profile.photos = [{ value: json.picture }];
  }
  if (json.email) {
    profile.emails = [{
      value: json.email,
      verified: json.email_verified
    }];
  }
  if (json.address) {
    profile.address = {
      locality: json.address.locality,
      region: json.address.region,
      postalCode: json.address.postal_code,
      country: json.address.country,
      formatted: json.address.formatted,
    };
  }

  return profile;
};