const canvas = document.getElementById("canvas").getContext("2d");

let plot = undefined;

const setup = () => {
  plot = new Chart(canvas, {
    type: "line",
    data: { datasets: [] },
  });

  const [lambda, n1, n2, n3, r, xmax] = [600, 1.5, 1, 1.5, 10, 0.01];

  document.getElementById("lambda").value = lambda;
  document.getElementById("n1").value = n1;
  document.getElementById("n2").value = n2;
  document.getElementById("n3").value = n3;
  document.getElementById("r").value = r;
  document.getElementById("xmax").value = xmax;

  make_plot(make_data(lambda, n1, n2, n3, r, xmax));
}

const make_plot = (data) => {
  plot.destroy();
  plot = new Chart(canvas, {
    type: "line",
    data: {
      datasets: [
        {
          label: "Интенсивность",
          borderColor: "rgba(200, 77, 123, .8)",
          data: data,
          lineTension: 0.4,
          pointRadius: 0
        },
      ]
    },
    options: {
      bezierCurve: false,
      scales: {
        x: {
          type: "linear",
          position: "bottom",
          title: { display: true, text: "x, м" }
        },
        y: {
          type: "linear",
          position: "left",
          title: { display: true, text: "I, Вт / м^2" }
        }
      },
      layout: {
        padding: 50,
      },
    }
  });
}

const make_data = (lambda, n1, n2, n3, r, xmax) => {
  const result = [];
  const i0 = 1;
  lambda = lambda / Math.pow(10, 9); // nano metre -> metre

  const left_border = 0
  const right_border = xmax;
  const size = right_border - left_border;
  const step = size / 1000;

  for (let x = left_border; x < right_border; x += step) {
    const h = x * x / (2 * r)
    const Delta = 2 * h * n2 + (lambda / 2) * (n3 > n2);
    const delta = 2 * Math.PI * Delta / lambda;
    result.push({
      x: x,
      y: 2 * i0 * (1 + Math.cos(delta))
    });
  }

  return result;
}

const parse_input = () => {
  return [
    parseFloat(document.getElementById("lambda").value),
    parseFloat(document.getElementById("n1").value),
    parseFloat(document.getElementById("n2").value),
    parseFloat(document.getElementById("n3").value),
    parseFloat(document.getElementById("r").value),
    parseFloat(document.getElementById("xmax").value),
  ]
}

const run = () => {
  const [lambda, n1, n2, n3, r, xmax] = parse_input();
  if (isNaN(lambda) || isNaN(n1) || isNaN(n2) || isNaN(n3) || isNaN(r) || isNaN(xmax)) {
    alert("Некорретный ввод!");
    return;
  }
  if (lambda <= 0 || n1 < 1 || n2 < 1 || n3 < 1 || r <= 0 || xmax <= 0) {
    alert("Некорретный ввод!");
    return;
  }
  make_plot(make_data(lambda, n1, n2, n3, r, xmax));
}
