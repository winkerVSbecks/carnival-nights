import { readable, derived } from 'svelte/store';
import queryString from 'query-string';

export const from = readable(null, function start(set) {
  if (typeof window !== 'undefined') {
    const parsed = queryString.parse(window.location.search);
    let from = parsed.from ? parsed.from : 'varun';
    set(from);
  }
});
