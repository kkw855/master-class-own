import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");

import { RouterLink, RouterView } from "vue-router";

import axios from "axios";
import {
  constVoid,
  flow,
  pipe,
  absurd,
  unsafeCoerce,
} from "fp-ts/es6/function";
import * as O from "fp-ts/es6/Option";
import * as A from "fp-ts/es6/Array";
import * as NEA from "fp-ts/es6/NonEmptyArray";
import * as E from "fp-ts/es6/Either";
import * as T from "fp-ts/es6/Task";
import type { Semigroup } from "fp-ts/es6/Semigroup";
import type { Monoid } from "fp-ts/es6/Monoid";
import { MonoidSum } from "fp-ts/es6/number";
import { ap } from "fp-ts/es6/Identity";
import { Lens, Optional } from "monocle-ts";
import { none, some } from "fp-ts/Option";

// 무조건 성공하는 Promise, 클라이언트가 Task 시그니쳐 보고 무조건 성공하는 비동기 함수라는 것을 인지할 수 있음
const boolTask: T.Task<boolean> = async () => {
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
// try-catch-finally 는 unknown. 어떤 에러가 발생할지 클라이언트가 알 수 없음
class MinLengthValidationError extends Error {
  readonly _tag: "PasswordMinLengthValidationError";

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
  readonly _tag: "PasswordCapitalLetterMissingValidationError";

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
  readonly _tag: "Password";
  readonly value: string;
  readonly isHashed: boolean;
}
function of(value: string): Password {
  return { _tag: "Password", value, isHashed: false };
}
function fromHashed(value: string): Password {
  return { _tag: "Password", value, isHashed: true };
}

type PasswordSpecification = {
  readonly minLength?: number;
  readonly capitalLetterRequired?: boolean;
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

type HashFn = (value: string) => E.Either<Error, string>;
function hash(hashFn: HashFn) {
  return (password: Password): E.Either<Error, Password> =>
    pipe(
      hashFn(password.value),
      E.map((value) => ({
        ...password,
        value,
        isHashed: true,
      }))
    );
}

const pipeline = flow(
  // Password 데이터 생성
  of,
  // 데이터 유효성 검사
  validate({ minLength: 8, capitalLetterRequired: true }),
  // Right 라면 패스워드 해싱
  E.chainW(hash((value) => E.right(`md5-${value}`)))
);
console.log(pipeline("pw123"));
console.log(pipeline("Password123"));

// TaskEither 는 Either 를 리턴하는 Promise
// (async () => {
//   const ok = await pipe(
//     TE.tryCatch(
//       () => axios.get("http://httpstat.us/500"),
//       () => constVoid() as never
//     ),
//     TE.map((resp) => unsafeCoerce<unknown, AxiosResponse>(resp.data)),
//     TE.fold(absurd, T.of)
//   )();
//
//   console.log(ok);
// })();

const foo = [1, 2, 3, 4, 5];

const sum = pipe(
  A.Functor.map(foo, (x) => x - 1),
  A.filter((x) => x % 2 === 0),
  A.reduce(0, (prev, next) => prev + next)
);
console.log(sum);

console.log(foo[10]);
foo[10] = 100;

console.log(pipe([1, 2, 3], A.lookup(1)));
console.log(pipe([1, 2, 3], A.lookup(3)));

if (foo.length > 0) {
  const firstElement = A.head(foo);
  console.log(firstElement);
}

if (A.isNonEmpty(foo)) {
  const firstElement = NEA.head(foo);
  console.log(firstElement);
}

const res = A.exists((n) => n === 1)(foo);
console.log();

const data = {
  categories: [
    {
      id: "c1",
      name: "Chats",
      forums: ["f1"],
    },
  ],
  forums: [
    {
      id: "f1",
      name: "fishing",
      description: "lets talk fishing",
      categoryId: "c1",
      threads: ["t1"],
    },
  ],
  users: [
    {
      id: "u1",
      name: "Alex",
    },
  ],
  threads: [
    {
      id: "t1",
      title: "What is your favorite food?",
      publishedAt: 1681681861,
      posts: [],
      userId: "u1",
    },
  ],
  posts: [
    {
      id: "p1",
      publishedAt: 1681681861,
      userId: "u1",
      text: "I like burgers, and you?",
      threadId: "t1",
    },
  ],
};

const u1 = pipe(
  data.posts,
  A.filter((p) => p.userId === "u1")
);
console.log(u1);

interface ReactionTest {
  readonly reactions?: {
    readonly [key: string]: {
      readonly [key: string]: string;
    };
  };
}

type Foo = {
  readonly _tag: "Foo";
  readonly f: () => number;
};

type Bar = {
  readonly _tag: "Bar";
  readonly g: () => number;
};

const arr: readonly (Foo | Bar)[] = [
  { _tag: "Foo", f: () => 1 },
  { _tag: "Foo", f: () => 2 },
  { _tag: "Foo", f: () => 3 },
  { _tag: "Bar", g: () => 1 },
  { _tag: "Bar", g: () => 2 },
  { _tag: "Bar", g: () => 3 },
];

console.log(typeof "abc");
console.log(
  pipe(
    arr,
    // 두 종류의 타입을 가진 배열에 데이터를 left, right 로 분리
    A.partitionMap((a) => (a._tag === "Foo" ? E.left(a) : E.right(a)))
  )
);

const semigroupMax: Semigroup<number> = {
  concat: (x, y) => Math.max(x, y),
};
const monoidMax: Monoid<number> = {
  empty: Number.NEGATIVE_INFINITY,
  concat: (x, y) => Math.max(x, y),
};

const compute = (arr: ReadonlyArray<Foo | Bar>) =>
  pipe(
    arr,
    A.partitionMap((a) => (a._tag === "Foo" ? E.left(a) : E.right(a))),
    ({ left: foos, right: bars }) => {
      const sum = A.Traversable.reduce(foos, 0, (prev, foo) => prev + foo.f());
      const max = A.Traversable.reduce(bars, monoidMax.empty, (max, bar) =>
        monoidMax.concat(max, bar.g())
      );
      return sum * max;
    }
  );

// 장황한 reduce 함수를 간결하게 만든다
const compute2 = (arr: ReadonlyArray<Foo | Bar>) =>
  pipe(
    arr,
    A.partitionMap((a) => (a._tag === "Foo" ? E.left(a) : E.right(a))),
    ({ left: foos, right: bars }) => {
      const sum = A.Traversable.foldMap(MonoidSum)(foos, (foo) => foo.f());
      const max = A.Traversable.foldMap(monoidMax)(bars, (bar) => bar.g());

      return sum * max;
    }
  );
console.log(compute(arr));
console.log(compute2(arr));

// declare function write(key: string, value: string, flush: boolean): unknown;
// const writeC = (key: string) => (value: string) => (flush: boolean) =>
//   write(key, value, flush);
// writeC("key")("value")(true);
// pipe(true, pipe("value", pipe("key", writeC)));
// pipe(writeC, ap("key"), ap("value"), ap(true));

const arr2 = [1, undefined, 3].map(O.of);
console.log(A.sequence(O.option)(arr2));

interface Street {
  readonly num: number;
  readonly name: string;
}
interface Address {
  readonly city: string;
  readonly street: Street;
}
interface Company {
  readonly name: string;
  readonly address: Address;
}
interface Employee {
  readonly name: string;
  readonly company: Company;
}

const employee: Employee = {
  name: "john",
  company: {
    name: "awesome inc",
    address: {
      city: "london",
      street: {
        num: 23,
        name: "high street",
      },
    },
  },
};

const company = Lens.fromProp<Employee>()("company");
const address = Lens.fromProp<Company>()("address");
const street = Lens.fromProp<Address>()("street");
const name = Lens.fromProp<Street>()("name");

const capitalize = (s: string): string =>
  s.substring(0, 1).toUpperCase() + s.substring(1);

const modified = company
  .compose(address)
  .compose(street)
  .compose(name)
  .modify(capitalize)(employee);

console.log(modified);

const name2 = Lens.fromPath<Employee>()([
  "company",
  "address",
  "street",
  "name",
]);
console.log(name2.modify(capitalize)(employee));

const firstLetter = new Optional<string, string>(
  (s) => (s.length > 0 ? some(s[0]) : none),
  (a) => (s) => {
    console.log(a, s);
    return a + s.substring(1);
  }
);

const modified2 = company
  .compose(address)
  .compose(street)
  .compose(name)
  .asOptional()
  .compose(firstLetter)
  .modify((s) => s.toUpperCase())(employee);

console.log(modified2);
console.log(employee);
