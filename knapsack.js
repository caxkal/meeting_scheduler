const solve = (pair, items) => {
    const [capacity, _] = pair
    const numItems = items.length

    // Setup matrices
    let weightMatrix = new Array(numItems + 1)
    let pathMatrix = new Array(numItems + 1)
    for (idxItem = 0; idxItem < numItems + 1; idxItem++) {
        weightMatrix[idxItem] = new Array(capacity + 1);
        pathMatrix[idxItem] = new Array(capacity + 1);
    }

    // Build table K[][] in bottom up manner
    for (let i = 0; i <= numItems; i++) {
        for (let w = 0; w <= capacity; w++) {
            if (i == 0 || w == 0) {
                weightMatrix[i][w] = 0
            } else if (items[i - 1] <= w) {
                const newMax = items[i - 1] + weightMatrix[i - 1][w - items[i - 1]]
                const oldMax = weightMatrix[i - 1][w]
                weightMatrix[i][w] = Math.max(newMax, oldMax)
                pathMatrix[i][w] = (newMax > oldMax) ? 1 : 0
            } else {
                weightMatrix[i][w] = weightMatrix[i - 1][w]
            }
        }
    }
    let bucket = capacity;
    let solutionSet = []
    for (let idxItem = numItems; idxItem > 0; idxItem--) {
        if (pathMatrix[idxItem][bucket] === 1) {
            solutionSet.push(items[idxItem - 1]);
            bucket = bucket - items[idxItem - 1];
        }
    }

    return {
        maxValue: weightMatrix[numItems][capacity],
        elements: solutionSet
    }
}

module.exports = {
    solve
}