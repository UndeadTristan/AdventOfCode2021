console.log("Day 21");

{
    const DiceSides = 100;
    const BoardSize = 10;
    const WinScore = 1000;

    class Dice
    {
        readonly sides: number;
        timesRolled: number = 0;

        constructor(sides: number)
        {
            this.sides = sides;
        }

        roll(): number
        {
            this.timesRolled++;
            return Math.ceil(Math.random() * this.sides);
        }
    }

    class DeterministicDice extends Dice
    {
        roll(): number 
        {
            super.roll();
            return ((this.timesRolled - 1) % this.sides) + 1;
        }
    }

    class Player
    {
        readonly id: number;
        score: number = 0;
        pos: number = 1;

        constructor(id: number, startPos: number)
        {
            this.id = id;
            this.pos = startPos;
        }

        move(moveBy: number)
        {
            const prevPos = this.pos;
            this.pos = this.pos + moveBy;

            while (this.pos > BoardSize)
            {
                this.pos -= BoardSize;
            }

            this.score += this.pos;

            console.log(`Player ${this.id} moved by ${moveBy} from ${prevPos} to ${this.pos}. New score ${this.score}.`);
        }
    }

    const p1 = new Player(1, 4);
    const p2 = new Player(2, 6);

    const players = [p1, p2];

    const p1board = new Array<Array<number>>(10);

    const dice = new DeterministicDice(DiceSides);
    let nextPlayer = 0;
    while(true)
    {
        const player = players[nextPlayer];

        if (++nextPlayer >= players.length)
        {
            nextPlayer = 0;
        }

        const moveBy = dice.roll() + dice.roll() + dice.roll();
        player.move(moveBy);

        if (player.score >= WinScore)
        {
            break;
        }
    }

    const minScore = Math.min(...players.map(p => p.score));

    console.log(dice.timesRolled * minScore);
}