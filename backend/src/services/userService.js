import { AppError } from '../utils/AppError.js';
import { parsePositiveInt } from '../utils/parse.js';

const GENDERS = Object.freeze(['female', 'male', 'non-binary', 'prefer-not-to-say']);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PG_UNIQUE_VIOLATION = '23505';

const asTrimmedString = (value) => (typeof value === 'string' ? value.trim() : '');

function validateName(value) {
  const name = asTrimmedString(value);
  if (name.length < 1 || name.length > 60) {
    throw new AppError('name must be 1-60 characters', 400);
  }
  return name;
}

// "  Maya@Example.com " -> "maya@example.com"
function validateEmail(value) {
  const email = asTrimmedString(value).toLowerCase();
  if (email.length > 120 || !EMAIL_PATTERN.test(email)) {
    throw new AppError('Enter a valid email address', 400);
  }
  return email;
}

function validatePassword(value) {
  if (typeof value !== 'string' || value.length < 4 || value.length > 100) {
    throw new AppError('password must be 4-100 characters', 400);
  }
  return value;
}

// "" / null / undefined -> null (field cleared), "28" -> 28, "abc" / 0 / 150 -> 400
function validateAge(value) {
  if (value === null || value === undefined || value === '') return null;
  const age = Number(value);
  if (!Number.isInteger(age) || age < 1 || age > 120) {
    throw new AppError('age must be a whole number between 1 and 120', 400);
  }
  return age;
}

function validateGender(value) {
  if (value === null || value === undefined || value === '') return null;
  if (!GENDERS.includes(value)) {
    throw new AppError(`gender must be one of: ${GENDERS.join(', ')}`, 400);
  }
  return value;
}

export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async signup({ name, email, password } = {}) {
    const data = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
    };
    try {
      return await this.userRepository.create(data);
    } catch (err) {
      if (err.code === PG_UNIQUE_VIOLATION) {
        throw new AppError('That email is already registered', 409);
      }
      throw err;
    }
  }

  // The "gate": a plain password comparison. Same message for unknown email
  // and wrong password so the response doesn't reveal which emails exist.
  async login({ email, password } = {}) {
    const record = await this.userRepository.findWithPasswordByEmail(
      asTrimmedString(email).toLowerCase()
    );
    if (!record || record.password !== password) {
      throw new AppError('Invalid email or password', 401);
    }
    const { password: _omit, ...user } = record;
    return user;
  }

  async getProfile(id) {
    const user = await this.userRepository.findById(parsePositiveInt(id, 'id'));
    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  // Email is the login identity, so it is not editable here.
  async updateProfile(id, { name, age, gender } = {}) {
    const userId = parsePositiveInt(id, 'id');
    const user = await this.userRepository.updateProfile(userId, {
      name: validateName(name),
      age: validateAge(age),
      gender: validateGender(gender),
    });
    if (!user) throw new AppError('User not found', 404);
    return user;
  }
}
