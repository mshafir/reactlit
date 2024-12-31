import {
  EnsureQueryDataOptions,
  QueryClient,
  QueryClientConfig,
  QueryKey,
  QueryObserver,
  Updater,
} from '@tanstack/react-query';
import { definePlugin } from '../hooks/use-reactlit';

export class DataFetcher<T> {
  constructor(
    private client: QueryClient,
    private trigger: () => void,
    private key: QueryKey,
    private fn: () => Promise<T>,
    private options?: Partial<
      EnsureQueryDataOptions<T, Error, T, QueryKey, never>
    >
  ) {}

  get() {
    const state = this.client.getQueryState(this.key);
    if (state?.status === 'error') {
      throw state.error;
    }
    this.client.ensureQueryData({
      queryKey: this.key,
      queryFn: async () => {
        // trigger before so we can see the loading state
        this.trigger();
        return this.fn();
      },
      ...this.options,
    });
    return this.client.getQueryData(this.key) as T;
  }

  update(updater: Updater<T, T>) {
    this.client.setQueryData<T, QueryKey, T>(this.key, updater);
    this.trigger();
  }

  async refetch() {
    await this.client.invalidateQueries({
      queryKey: this.key,
      refetchType: 'all',
    });
    this.trigger();
  }

  isFetching() {
    const state = this.client.getQueryState(this.key);
    return (
      !state || state?.status === 'pending' || state?.fetchStatus === 'fetching'
    );
  }
}

export function makeDataFetchingPlugin(config?: QueryClientConfig) {
  const client = new QueryClient(config);
  let isMounted = false;
  return definePlugin((ctx) => {
    if (!isMounted) {
      client.mount();
      const observer = new QueryObserver(client, {
        queryKey: [],
      });
      observer.subscribe(() => {
        ctx.trigger();
      });
      isMounted = true;
    }
    return {
      fetcher<T>(
        key: QueryKey,
        fn: () => Promise<T>,
        options?: Partial<EnsureQueryDataOptions<T, Error, T, QueryKey, never>>
      ) {
        return new DataFetcher(client, ctx.trigger, key, fn, options);
      },
    };
  });
}

export const DataFetchingPlugin = makeDataFetchingPlugin();

// re-export to avoid portability errors
export { QueryKey, EnsureQueryDataOptions };
