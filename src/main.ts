interface Reserva {
  tipoHabitacion: "standard" | "suite";
  desayuno: boolean;
  pax: number;
  noches: number;
}

const reservas: Reserva[] = [
  {
    tipoHabitacion: "standard",
    desayuno: false,
    pax: 1,
    noches: 3,
  },
  {
    tipoHabitacion: "standard",
    desayuno: false,
    pax: 1,
    noches: 4,
  },
  {
    tipoHabitacion: "suite",
    desayuno: true,
    pax: 2,
    noches: 1,
  },
];

class HotelReservaBase {
  protected reservas: Reserva[];
  protected precios: { [key: string]: number };
  protected readonly cargoExtraPorPersona: number = 40;
  protected readonly cargoDesayunoPorPersona: number = 15;
  protected readonly iva: number = 0.21;

  constructor(reservas: Reserva[], precios: { [key: string]: number }) {
    this.reservas = reservas;
    this.precios = precios;
  }

  protected calcularSubtotal(): number {
    return this.reservas.reduce((subtotal, reserva) => {
      const precioBase = this.precios[reserva.tipoHabitacion];
      const cargoExtra =
        reserva.pax > 1 ? (reserva.pax - 1) * this.cargoExtraPorPersona : 0;
      const cargoDesayuno = reserva.desayuno
        ? reserva.pax * reserva.noches * this.cargoDesayunoPorPersona
        : 0;
      return (
        subtotal + (precioBase + cargoExtra + cargoDesayuno) * reserva.noches
      );
    }, 0);
  }

  public calcularTotal(): { subtotal: number; total: number } {
    const subtotal = this.calcularSubtotal();
    const total = subtotal * (1 + this.iva);
    return { subtotal, total };
  }
}

class HotelReservaParticular extends HotelReservaBase {
  constructor(reservas: Reserva[]) {
    super(reservas, { standard: 100, suite: 150 });
  }
}

class HotelReservaTourOperador extends HotelReservaBase {
  private readonly descuento: number = 0.15;

  constructor(reservas: Reserva[]) {
    super(reservas, { standard: 100, suite: 100 }); // Precio único para Tour Operador
  }

  protected calcularSubtotal(): number {
    const subtotalSinDescuento = super.calcularSubtotal();
    return subtotalSinDescuento - subtotalSinDescuento * this.descuento;
  }
}

const reservaParticular = new HotelReservaParticular(reservas);
console.log("Cliente Particular:", reservaParticular.calcularTotal());

const reservaTourOperador = new HotelReservaTourOperador(reservas);
console.log("Tour Operador:", reservaTourOperador.calcularTotal());
