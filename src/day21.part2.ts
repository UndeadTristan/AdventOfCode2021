console.log("Day 21 - part 2");

{
    const Player1Start = 4;
    const Player2Start = 6;
    const BoardSize = 10;
    const WinScore = 21;
    const DiceSides = 3;

    function boardKey(board: number[]): string
    {
        return board.join(',');
    }

    const wins = [0, 0];

    let boards: { [key: string]: number } = {};
    boards[boardKey([Player1Start, Player2Start, 0, 0])] = 1;

    while(Object.entries(boards).length)
    {
        for (let m of [0, 1])
        {
            const nextBoards: { [key: string]: number } = {};

            for (const [key, count] of Object.entries(boards))
            {
                const board = key.split(',').map(Number);
                const bp = board[m];
                const bs = board[m + 2];

                // Dirac dice when you roll it, the universe splits into multiple copies, 
                // one copy for each possible outcome of the die. In this case, rolling 
                // the die always splits the universe into three copies: one where the 
                // outcome of the roll was 1, one where it was 2, and one where it was 3.
                for (let d1=1; d1 <= DiceSides; ++d1)
                for (let d2=1; d2 <= DiceSides; ++d2)
                for (let d3=1; d3 <= DiceSides; ++d3)
                {
                    const r = d1 + d2 + d3;
                    const p = bp + r > BoardSize ? bp + r - BoardSize : bp + r;
                    const s = bs + p;

                    if (s >= WinScore)
                    {
                        wins[m] += count;
                    }
                    else
                    {
                        const nextBoard = [...board];
                        nextBoard[m] = p;
                        nextBoard[m + 2] = s;

                        const nextKey = boardKey(nextBoard);
                        nextBoards[nextKey] = (nextBoards[nextKey] || 0) + count;
                    }
                }
            }
            boards = nextBoards;
        }
    }

    console.log(Math.max(...wins)); 
}