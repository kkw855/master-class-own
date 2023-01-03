<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "./components/HelloWorld.vue";

import { flow, identity, pipe } from "fp-ts/lib/function";
import { Task } from "fp-ts/lib/Task";
import * as E from "fp-ts/lib/Either";

// 무조건 성공하는 Promise, 클라이언트가 Task 시그니쳐 보고 무조건 성공하는 비동기 함수라는 것을 인지할 수 있음
const boolTask: Task<boolean> = async () => {
  try {
    // 비동기 함수 호출 await axios.get()
    return true;
    // eslint-disable-next-line no-unreachable
  } catch (err) {
    return false;
  }
};
console.log(boolTask());

// Either<E, A> 시그니쳐 E 타입을 보고 클라이언트가 어떤 에러가 발생하는지 알 수 있음
class MinLengthValidationError extends Error {
  _tag: "PasswordMinLengthValidationError";

  private constructor(readonly minLength: number) {
    super(`password fails to meet min length requirement: ${minLength}`);

    this._tag = "PasswordMinLengthValidationError";
  }

  static of(minLength: number): MinLengthValidationError {
    return new MinLengthValidationError(minLength);
  }
}

const minErr = MinLengthValidationError.of(5);
minErr._tag = "PasswordMinLengthValidationError";
console.log(minErr._tag);
console.log(minErr.minLength);
console.log(minErr);

class CapitalLetterMissingValidationError extends Error {
  _tag: "PasswordCapitalLetterMissingValidationError";

  private constructor() {
    super("password is missing a capital letter");
    this._tag = "PasswordCapitalLetterMissingValidationError";
  }

  static of(): CapitalLetterMissingValidationError {
    return new CapitalLetterMissingValidationError();
  }
}
console.log(CapitalLetterMissingValidationError.of());

// Sum Type
type PasswordValidationError =
  | MinLengthValidationError
  | CapitalLetterMissingValidationError;

interface Password {
  _tag: "Password";
  value: string;
  isHashed: boolean;
}
function of(value: string): Password {
  return { _tag: "Password", value, isHashed: false };
}
function fromHashed(value: string): Password {
  return { _tag: "Password", value, isHashed: true };
}

type PasswordSpecification = {
  minLength?: number;
  capitalLetterRequired?: boolean;
};

function validate({
  minLength = 0,
  capitalLetterRequired = false,
}: PasswordSpecification = {}) {
  return (password: Password): E.Either<PasswordValidationError, Password> => {
    if (password.value.length < minLength) {
      return E.left(MinLengthValidationError.of(minLength));
    }

    if (capitalLetterRequired && !/[A-Z]/.test(password.value)) {
      return E.left(CapitalLetterMissingValidationError.of());
    }

    return E.right({ ...password, isValidated: true });
  };
}

type HashFn = (value: string) => string;
function hash(hashFn: HashFn) {
  return (password: Password): Password => ({
    ...password,
    value: hashFn(password.value),
    isHashed: true,
  });
}

const pipeline = flow(
  of,
  validate({ minLength: 8, capitalLetterRequired: true }),
  E.map(hash((value) => `md5-${value}`))
);
console.log(pipe("pw123", pipeline));
console.log(pipe("Password123", pipeline));
</script>

<template>
  <header>
    <img
      alt="Vue logo"
      class="logo"
      src="@/assets/logo.svg"
      width="125"
      height="125"
    />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
