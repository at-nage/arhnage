import type { Lambda } from "../lambda/index.ts";

export type Pipe = {
	<INITIAL, A>(initial: INITIAL, fn1: Lambda<[INITIAL], A>): A;
	<INITIAL, A, B>(initial: INITIAL, fn1: Lambda<[INITIAL], A>, fn2: Lambda<[A], B>): B;
	<INITIAL, A, B, C>(initial: INITIAL, fn1: Lambda<[INITIAL], A>, fn2: Lambda<[A], B>, fn3: Lambda<[B], C>): C;
	<INITIAL, A, B, C, D>(initial: INITIAL, fn1: Lambda<[INITIAL], A>, fn2: Lambda<[A], B>, fn3: Lambda<[B], C>, fn4: Lambda<[C], D>): D;
	<INITIAL, A, B, C, D, E>(initial: INITIAL, fn1: Lambda<[INITIAL], A>, fn2: Lambda<[A], B>, fn3: Lambda<[B], C>, fn4: Lambda<[C], D>, fn5: Lambda<[D], E>): E;
	<INITIAL, A, B, C, D, E, F>(
		initial: INITIAL,
		fn1: Lambda<[INITIAL], A>,
		fn2: Lambda<[A], B>,
		fn3: Lambda<[B], C>,
		fn4: Lambda<[C], D>,
		fn5: Lambda<[D], E>,
		fn6: Lambda<[E], F>,
	): F;
	<INITIAL, A, B, C, D, E, F, G>(
		initial: INITIAL,
		fn1: Lambda<[INITIAL], A>,
		fn2: Lambda<[A], B>,
		fn3: Lambda<[B], C>,
		fn4: Lambda<[C], D>,
		fn5: Lambda<[D], E>,
		fn6: Lambda<[E], F>,
		fn7: Lambda<[F], G>,
	): G;
	<INITIAL, A, B, C, D, E, F, G, H>(
		initial: INITIAL,
		fn1: Lambda<[INITIAL], A>,
		fn2: Lambda<[A], B>,
		fn3: Lambda<[B], C>,
		fn4: Lambda<[C], D>,
		fn5: Lambda<[D], E>,
		fn6: Lambda<[E], F>,
		fn7: Lambda<[F], G>,
		fn8: Lambda<[G], H>,
	): H;
	<INITIAL, A, B, C, D, E, F, G, H, I>(
		initial: INITIAL,
		fn1: Lambda<[INITIAL], A>,
		fn2: Lambda<[A], B>,
		fn3: Lambda<[B], C>,
		fn4: Lambda<[C], D>,
		fn5: Lambda<[D], E>,
		fn6: Lambda<[E], F>,
		fn7: Lambda<[F], G>,
		fn8: Lambda<[G], H>,
		fn9: Lambda<[H], I>,
	): I;
	<INITIAL, A, B, C, D, E, F, G, H, I, J>(
		initial: INITIAL,
		fn1: Lambda<[INITIAL], A>,
		fn2: Lambda<[A], B>,
		fn3: Lambda<[B], C>,
		fn4: Lambda<[C], D>,
		fn5: Lambda<[D], E>,
		fn6: Lambda<[E], F>,
		fn7: Lambda<[F], G>,
		fn8: Lambda<[G], H>,
		fn9: Lambda<[H], I>,
		fn10: Lambda<[I], J>,
	): J;
	<INITIAL, A, B, C, D, E, F, G, H, I, J, K>(
		initial: INITIAL,
		fn1: Lambda<[INITIAL], A>,
		fn2: Lambda<[A], B>,
		fn3: Lambda<[B], C>,
		fn4: Lambda<[C], D>,
		fn5: Lambda<[D], E>,
		fn6: Lambda<[E], F>,
		fn7: Lambda<[F], G>,
		fn8: Lambda<[G], H>,
		fn9: Lambda<[H], I>,
		fn10: Lambda<[I], J>,
		fn11: Lambda<[J], K>,
	): K;
	<INITIAL, A, B, C, D, E, F, G, H, I, J, K, L>(
		initial: INITIAL,
		fn1: Lambda<[INITIAL], A>,
		fn2: Lambda<[A], B>,
		fn3: Lambda<[B], C>,
		fn4: Lambda<[C], D>,
		fn5: Lambda<[D], E>,
		fn6: Lambda<[E], F>,
		fn7: Lambda<[F], G>,
		fn8: Lambda<[G], H>,
		fn9: Lambda<[H], I>,
		fn10: Lambda<[I], J>,
		fn11: Lambda<[J], K>,
		fn12: Lambda<[K], L>,
	): L;
};
