import { розібрати } from "./ісх"

const benchmark = (func : (_: any) => any, params: any, iterations: number) => {
    const t0 = performance.now()    
    
    for (let i = 0; i < iterations; i++) {
        let x = func(params)
    }

    const t1 = performance.now()
    
    return `${1000 * (t1 - t0) / iterations} us`
}

console.log(benchmark(розібрати, `(а=2, "б"="2", є=[], Ї=(), Ґ=Книжка(), 999=238)`, 100_000));
console.log(benchmark(розібрати, `Паспорт(
    прізвище="Когут",
    імʼя="Давид",
    по_батькові="Богданович",
    дата_народження=Дата(
      день=20,
      місяць=1,
      рік=2001
    ),
    борг=пусто,
    застарілий=ні
  )`, 100_000));
  console.log(benchmark(розібрати, `[1, -2, 3.14, "привіт", Людина(імʼя="Давид"), ["2211"]]`, 100_000));
  console.log(process.memoryUsage());
