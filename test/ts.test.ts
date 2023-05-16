test('adds 1 + 2 to equal 3', () => {
  const a = "";
  expect(a).toBe(`${a}`)
  expect(1+2).toBe(3);
  testNull({radius: 10, color: "yellow"});
});

function testNull(x: ColorfulCircleInterface) {
  console.log(x.color);
}

interface Colorful {
  color: string;
}
interface Circle {
  radius: number;
}
 
type ColorfulCircle = Colorful & Circle;

interface ColorfulCircleInterface extends Colorful, Circle {}