// List of columns you actually have in DB (no logic here)
const USER_TABLE = 'users';

const USER_COLUMNS = [
  'id',
  'name',
  'email',
  'email_verified_at',
  'password',
  'remember_token',
  'created_at',
  'updated_at',
  'deleted_at'
];

module.exports = {
  USER_TABLE,
  USER_COLUMNS
};
