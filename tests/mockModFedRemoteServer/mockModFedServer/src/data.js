const primitive = 'A static string';
const func = () => 'primitive no arg function';
const argFunc = (p) => p;
const complex = {
  parent: {
    child: 'Eric Cartman',
  },
};

class SampleClass {
  item;

  constructor(item) {
    this.item = item;
  }

  print() {
    console.log(this.item);
  }
}

export default {
  primitive,
  func,
  argFunc,
  complex,
  SampleClass,
};
