export const LEVELS = [
  {
    id: 'level-1-easy',
    name: 'Beginner Rage',
    length: 4000,
    speed: 420,
    gravity: 2200,
    jumpForce: 700,
    checkpoints: [600, 1400, 2300, 3200],
    obstacles: [
      // obstacle x, width, height (from ground)
      [500, 40, 80],
      [760, 30, 120],
      [980, 60, 150],
      [1300, 40, 100],
      [1700, 24, 140],
      [2000, 60, 180],
      [2500, 40, 120],
      [2900, 40, 160],
      [3400, 60, 200]
    ]
  },
  {
    id: 'level-2-medium',
    name: 'Trial by Spikes',
    length: 7000,
    speed: 520,
    gravity: 2400,
    jumpForce: 780,
    checkpoints: [700, 1600, 2700, 3900, 5400],
    obstacles: (()=>{
      const arr=[];
      // denser pattern with micro jumps and tall spikes
      let x=500;
      for(let i=0;i<40;i++){
        const w = (i%6===0)?60: (i%3===0)?40:24;
        const h = 60 + ((i*37)%160);
        x += 120 + ((i*29)%140);
        arr.push([x,w,h]);
      }
      return arr;
    })()
  },
  {
    id: 'level-3-insane',
    name: 'Rage Cathedral',
    length: 12000,
    speed: 620,
    gravity: 2600,
    jumpForce: 820,
    checkpoints: [800, 1800, 3000, 4200, 5600, 7200, 8800, 10400],
    obstacles: (()=>{
      const arr=[]; let x=400;
      // intentionally punishing gaps and tightly spaced micro-obstacles
      for(let i=0;i<140;i++){
        const gap = (i%10===0)? 420 : (i%7===0)? 80 : (i%5===0)?240: 110 + (i%4)*20;
        x += gap;
        const w = (i%11===0)? 90 : (i%4===0)?40:24;
        const h = 50 + ((i*19)%300);
        arr.push([x,w,h]);
      }
      return arr;
    })()
  }
];
