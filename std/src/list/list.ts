import { Lambda } from "../index.ts";

export type List<T> = ArrayLike<T> & object;

interface Iter {
  <A>(iterator: Lambda<[value: A, index: number, list: List<A>], void>): (list: List<A>) => void
  <A, B>(list: List<A>, iterator: Lambda<[value: A, index: number, list: List<A>], B>): void
}

const iter: Iter = Lambda.fflip(<A>(list: List<A>, iterator: Lambda<[A, number, List<A>], void>) => {
  for (let i = 0; i < list.length; i++) {
    iterator(list[i], i, list);
  }
});

interface Map {
  <A, B>(mapper: Lambda<[value: A, index: number, list: List<A>], B>): (list: List<A>) =>List<B>
  <A, B>(list: List<A>, mapper: Lambda<[value: A, index: number, list: List<A>], B>): List<B>
}

const map: Map = Lambda.fflip(<A, B>(list: List<A>, mapper: Lambda<[A, number, List<A>], B>): List<B> => {
  const array = new Array(list.length);

  for (let i = 0; i < list.length; i++) {
    array[i] = mapper(list[i], i, list);
  }

  return array;
});

export const List = {
  iter,
  map,
}
