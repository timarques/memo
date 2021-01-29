type MemoCallback<T extends unknown[], TResult> = (...args: T) => TResult;

interface MemoOptions {
	duration?: number
}

interface MemoCacheItem<T extends unknown[], TResult> {
	key: T,
	result: TResult,
	createdAt: number
}

const memo = <T extends unknown[], TResult>(
	callback: MemoCallback<T, TResult>,
	options: MemoOptions = {}
) => {
	let cache: MemoCacheItem<T, TResult>[] = []

	const findCacheItemIndex = ( args: T ): number => {
		return cache.findIndex(({ key }) => (
			key.length === args.length &&
			args.every((argument, index) => (
				argument === key[index]
			))
		))
	}
	
	const validateCacheItem = ({ createdAt }: MemoCacheItem<T, TResult>): boolean => {
		const { duration } = options
		if (!duration) return true
		const currentMilliseconds = Date.now()
		return createdAt + duration > currentMilliseconds
	}
	
	const removeCacheItem = (index: number): void => {
		cache.splice(index, 1)
	}
	
	const findCacheItem = (key: T): undefined | MemoCacheItem<T, TResult> => {
		const cacheItemIndex = findCacheItemIndex(key)
		if (cacheItemIndex === -1) return undefined
		const cacheItem = cache[cacheItemIndex]
		const cacheItemValidation = validateCacheItem(cacheItem)
		if (cacheItemValidation) return cacheItem
		removeCacheItem(cacheItemIndex)
		return undefined
	}
	
	const createCacheItem = (key: T) => {
		const result = callback(...key)
		const createdAt = Date.now()
		const item = { key, result, createdAt }
		cache.push(item)
		return item
	}


	const memoized = (...key: T) => {
		const cacheItem = findCacheItem(key)
		return (cacheItem || createCacheItem(key)).result
	}
	memoized.getOptions = () => options
	memoized.getCallback = () => callback
	memoized.has = (...key: T): boolean => !!findCacheItem(key)
	memoized.clear = (): void => {
		cache = [] as MemoCacheItem<T, TResult>[]
	}
	memoized.remove = (...key: T): boolean => {
		const index = findCacheItemIndex(key)
		if (index === -1) return false
		removeCacheItem(index)
		return true
	}
	return memoized
}

export default memo
export type { MemoCallback, MemoOptions }