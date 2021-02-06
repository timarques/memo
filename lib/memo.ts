interface MemoOptions {
	duration?: number
}

interface MemoCacheItem<T extends Callback> {
	key: CallbackParameters<T>,
	result: ReturnType<T>,
	createdAt: number
}

type Callback = (...args: any[]) => any

type CallbackParameters<T extends Callback> = T extends (...args: infer A) => any ? A : never

type MemoOutput<T extends Callback> = T & {
	has(...key: CallbackParameters<T>): boolean,
	clear(): void,
	remove(...key: CallbackParameters<T>): boolean
}

const memo = <T extends Callback>(
	callback: T,
	options: MemoOptions = {}
): MemoOutput<T> => {
	let cache: MemoCacheItem<T>[] = []

	const findCacheItemIndex = ( args: CallbackParameters<T> ): number => {
		return cache.findIndex(({ key }) => (
			key.length === args.length &&
			args.every((argument, index) => (
				argument === key[index]
			))
		))
	}
	
	const validateCacheItem = ({ createdAt }: MemoCacheItem<T>): boolean => {
		const { duration } = options
		if (!duration) return true
		const currentMilliseconds = Date.now()
		return createdAt + duration > currentMilliseconds
	}
	
	const removeCacheItem = (index: number): void => {
		cache.splice(index, 1)
	}
	
	const findCacheItem = (key: CallbackParameters<T>): undefined | MemoCacheItem<T> => {
		const cacheItemIndex = findCacheItemIndex(key)
		if (cacheItemIndex === -1) return undefined
		const cacheItem = cache[cacheItemIndex]
		const cacheItemValidation = validateCacheItem(cacheItem)
		if (cacheItemValidation) return cacheItem
		removeCacheItem(cacheItemIndex)
		return undefined
	}
	
	const createCacheItem = (key: CallbackParameters<T>) => {
		const result = callback(...key)
		const createdAt = Date.now()
		const item = { key, result, createdAt }
		cache.push(item)
		return item
	}

	const memoized = (...key: CallbackParameters<T>): ReturnType<T> => {
		const cacheItem = findCacheItem(key)
		return (cacheItem || createCacheItem(key)).result
	}
	memoized.has = (...key: CallbackParameters<T>): boolean => !!findCacheItem(key)
	memoized.clear = (): void => {
		cache = [] as MemoCacheItem<T>[]
	}
	memoized.remove = (...key: CallbackParameters<T>): boolean => {
		const index = findCacheItemIndex(key)
		if (index === -1) return false
		removeCacheItem(index)
		return true
	}
	return memoized as MemoOutput<T>
}

export default memo
export type { MemoOptions }
