<template>
  <div>Hello from page home</div>
  <div v-for="thread in threads" :key="thread">
    <h2>{{ thread.title }}</h2>
    <div v-for="postId in thread.posts" :key="postId">
      <p>
        {{
          O.fold(
            () => "unknown user",
            ({ name }) => name
          )(userById(postId))
        }}
      </p>
      <p>
        {{
          O.fold(
            () => "unknown post",
            ({ text }) => text
          )(postById(postId))
        }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import sourceData from "@/data.json";
import type Thread from "@/types/Thread";
import type Post from "@/types/Post";
import * as A from "fp-ts/es6/Array";
import * as O from "fp-ts/es6/Option";
import { pipe } from "fp-ts/es6/function";
import type User from "@/types/User";

const threads: Thread[] = sourceData.threads;
// json 파일에 포함된 emoji 를 위해서
const posts: Post[] = JSON.parse(JSON.stringify(sourceData.posts));
const users: User[] = sourceData.users;

// TODO: postId 에 해당하는 post 가 있는지 확인
// const checkPost = (id: string) =>
//   pipe(
//     posts,
//     A.exists((post) => post.id === id)
//   );

// TODO: 해당 postId 데이터 가져오기. 순수 함수가 아님 posts 도 파라미터로 전달해야 할 듯. 유닛 테스트 배우고 해야 할 듯
const _postById =
  (posts: Post[]) =>
  (postId: string): O.Option<Post> =>
    A.findFirst((post: Post) => post.id === postId)(posts);

const postById = _postById(posts);

const _userById = (posts: Post[], users: User[]) => (postId: string) =>
  pipe(
    postId,
    postById,
    O.chain(({ userId }) =>
      A.findFirst((user: User) => user.id === userId)(users)
    )
  );

const userById = _userById(posts, users);
</script>

<style scoped></style>
