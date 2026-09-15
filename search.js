/**
 * @typedef {Object} SearchEntry
 * @property {string} name
 * @property {*} value
 */

export default class SearchIndex {

    /**
     * @param {SearchEntry[]} entries
     */

    constructor(entries) {
        this.entries = entries
    }

    add(entry) {
        this.entries.push(entry)
    }

    #score(entry, query) {
        const a = query.toLowerCase()
        const b = entry.name.toLowerCase()

        if (a === b) return 1

        let score = this.#jaroWinkler(a, b)

        if (b.startsWith(a)) {
            score += 0.15
        }

        if (b.length < a.length) {
            const difference = a.length - b.length
            score -= difference * 0.03
        }

        return Math.max(0, Math.min(score, 0.99))
    }

    search(query, limit = 10, minScore = 0.5) {
        const results = []

        for (const entry of this.entries) {
            const score = this.#score(entry, query)

            if (score < minScore) continue

            results.push({ entry, score })
        }

        results.sort((a, b) => b.score - a.score)

        return results.slice(0, limit)
    }
}