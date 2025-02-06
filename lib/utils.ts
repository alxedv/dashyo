import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}

export function customerCategoryColor(category: string) {
  if (!category) return '';
  const colors = {
    ['Alexandre']: '#FF0000',
    ['Nilson']: '#FFFF00',
    ['Pequeno produtor']: '#008000'
  };

  return colors[category as keyof typeof colors];
}

export function formatAddress(address: string) {
  const splitted = address.split(', ');
  let formatedAddress = '';

  if (splitted.length > 7) {
    const street = splitted[0] !== undefined ? splitted[0] : '';
    const city = splitted[2] !== undefined ? splitted[2] : '';
    const uf = splitted[5] !== undefined ? splitted[5] : '';

    formatedAddress = `${street} - ${city}, ${uf}`;
  } else if (splitted.length === 6) {
    const city = splitted[0] !== undefined ? splitted[0] : '';
    const uf = splitted[3] !== undefined ? splitted[3] : '';

    formatedAddress = `${city}, ${uf}`;
  } else {
    const city = splitted[0] !== undefined ? splitted[0] : '';
    const uf = splitted[4] !== undefined ? splitted[4] : '';

    formatedAddress = `${city}, ${uf}`;
  }

  return formatedAddress;
}

export function debounce<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

export const convertStringToDate = (string: string) => {
  if (!string) return 'Nenhuma data definida';
  const date = new Date(string);
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' } as any;
  const formattedDate = new Intl.DateTimeFormat('pt-BR', options).format(date);
  return formattedDate;
};

export function getMostRecentObjectDetails(arr: any) {
  let mostRecentObject = null;

  for (let i = 0; i < arr.length; i++) {
    const currentDate = Date.parse(arr[i].visitingDay);

    if (
      !isNaN(currentDate) &&
      (mostRecentObject === null || currentDate > Date.parse(mostRecentObject.visitingDay))
    ) {
      mostRecentObject = arr[i];
    }
  }

  if (mostRecentObject) {
    const { customerName, city, uf, visitingDay } = mostRecentObject;
    const formattedDate = new Date(visitingDay).toLocaleDateString();
    return `${customerName} - ${city}, ${uf} ${formattedDate}`;
  } else {
    return 'No objects with valid dates found.';
  }
}

export function sumDate(data: any, days: any) {
  var novaData = new Date(data + 'T10:00');
  novaData.setUTCDate(novaData.getUTCDate() + parseInt(days));
  const year = novaData.getFullYear();
  const month = novaData.getMonth() + 1; // Os meses são indexados a partir de 0, então adicionamos 1
  const day = novaData.getDate();
  return `${day}/${month}/${year}`;
}

export function getAbbreviation(stateName: string) {
  const stateAbbreviations = {
    Acre: 'AC',
    Alagoas: 'AL',
    Amapa: 'AP',
    Amazonas: 'AM',
    Bahia: 'BA',
    Ceara: 'CE',
    'Distrito Federal': 'DF',
    'Espirito Santo': 'ES',
    Goias: 'GO',
    Maranhao: 'MA',
    'Mato Grosso': 'MT',
    'Mato Grosso do Sul': 'MS',
    'Minas Gerais': 'MG',
    Para: 'PA',
    Paraiba: 'PB',
    Parana: 'PR',
    Pernambuco: 'PE',
    Piaui: 'PI',
    'Rio de Janeiro': 'RJ',
    'Rio Grande do Norte': 'RN',
    'Rio Grande do Sul': 'RS',
    Rondonia: 'RO',
    Roraima: 'RR',
    'Santa Catarina': 'SC',
    'Sao Paulo': 'SP',
    Sergipe: 'SE',
    Tocantins: 'TO'
  };

  const abbreviation = stateAbbreviations[stateName];
  return abbreviation || 'Sigla não encontrada';
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export const authFormSchema = (type: string) => z.object({
  name: type === "sign-in" ? z.string().optional() : z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
  companyName: z.string().optional()
})

export function formatPhoneNumber(phone: string): string {
  const cleanPhone = phone.replace('+', '');

  const countryCode = cleanPhone.slice(0, 2);
  const areaCode = cleanPhone.slice(2, 4);
  const firstPart = cleanPhone.slice(4, 9);
  const secondPart = cleanPhone.slice(9);

  return `(${areaCode}) ${firstPart}-${secondPart}`;
}

export const customerFormSchema = () => z.object({
  name: z.string().min(1, { message: "Nome é um campo obrigatório" }),
  contact: z.string().min(1, { message: "Contato é um campo obrigatório" }),
  phone: z.string().min(1, { message: "Telefone é um campo obrigatório" }),
  // supervisor: z.string().min(1, { message: "Supervisor é um campo obrigatório" }),
  visitDate: z.any({ message: "Data é um campo obrigatório" }),
  recurrence: z.string({ message: "Recorrência é um campo obrigatório" }).min(0).optional(),
  representative: z.any().optional(),
  notes: z.any().optional(),
})

export const equipmentFormSchema = () => z.object({
  equipment: z.string().min(1, { message: "Equipamento é um campo obrigatório" }),
  value: z.number().min(0, { message: "Valor é um campo obrigatório" }),
  margin: z.string().min(1, { message: "Margem é um campo obrigatório" }),
  saleChance: z.string().min(1, { message: "Chance de venda é um campo obrigatório" }),
  saleStatus: z.string().min(1, { message: "Status é um campo obrigatório" }),
  reason: z.string().min(1, { message: "Motivo é um campo obrigatório" }).min(0),
  saleType: z.string().min(1, { message: "Tipo é um campo obrigatório" }),
})

export const americaPrefixes = {
  "+54": "AR",
  "+297": "AW",
  "+591": "BO",
  "+55": "BR",
  "+56": "CL",
  "+57": "CO",
  "+506": "CR",
  "+53": "CU",
  "+599": "CW",
  "+593": "EC",
  "+503": "SV",
  "+500": "FK",
  "+502": "GT",
  "+509": "HT",
  "+504": "HN",
  "+52": "MX",
  "+505": "NI",
  "+507": "PA",
  "+595": "PY",
  "+51": "PE",
  "+598": "UY",
  "+58": "VE",
  "+592": "GY",
  "+594": "GF",
  "+597": "SR",
};

export function capitalizeWords(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getNextVisitDates(m) {
  const { visitDate, recurrence } = m;
  const firstVisit = new Date(visitDate);

  const nextVisits = [];

  // Fun o para formatar a data no formato "02 de janeiro de 2024"
  function formatDate(date) {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  // Gerar as pr ximas 5 datas
  for (let i = 1; i <= 5; i++) {
    const nextVisit = new Date(firstVisit);
    nextVisit.setDate(firstVisit.getDate() + (i * recurrence) + 1);
    nextVisits.push(formatDate(nextVisit));
  }

  return nextVisits;
}

export function nextVisitDate(visitDate, recurrence) {
  if (!visitDate || !recurrence) {
    return null; // Retorna null se os parâmetros não forem válidos
  }

  const nextVisit = new Date(visitDate);
  nextVisit.setDate(nextVisit.getDate() + parseInt(recurrence));

  console.log({
    visitDate,
    recurrence,
    nextVisit,
  });

  return nextVisit.toISOString();
}