// Dados de demonstração. Nomes, datas, valores e palestrantes são FICTÍCIOS.
const EVENT={nome:'T3 Experience 2027',cidade:'Montes Claros · MG',dias:[{d:'QUI',n:13},{d:'SEX',n:14},{d:'SÁB',n:15}],mes:'mai'};
const C={gold:'linear-gradient(135deg,#F5E6C4,#D4C08E)',sage:'linear-gradient(135deg,#c9d7a5,#7f9a52)',lilac:'linear-gradient(135deg,#d7b6e0,#8d5d9e)',sky:'linear-gradient(135deg,#bcd3e6,#5d86a8)',rose:'linear-gradient(135deg,#f3c6b8,#d48d79)',sand:'linear-gradient(135deg,#efe0c2,#b59a68)',slate:'linear-gradient(135deg,#c9cdd6,#6e7585)'};
const SESS=[
 [ {id:'s0',h:'07:30',dur:90,t:'Credenciamento e café de boas-vindas',room:'foyer',track:'Networking',desc:'Retire sua credencial com o QR do app e aproveite o café no foyer.'},
   {id:'s1',h:'09:00',dur:60,t:'Em qual liga sua empresa vai jogar em 2027?',spk:'Rafael Andrade',role:'Fundador · T3 Hub',av:'RA',c:C.gold,room:'palco',track:'Palco Liga',live:true,aud:612,tags:['Estratégia','Abertura'],desc:'Abertura oficial: o cenário do Norte de Minas, o que mudou no último ano e por que o ambiente define o resultado.'},
   {id:'s2',h:'10:30',dur:50,t:'Gestão à vista: o painel que o dono olha toda segunda',spk:'Carla Menezes',role:'CFO · Grupo varejista',av:'CM',c:C.sky,room:'gestao',track:'Sala Gestão',tags:['Finanças','Gestão'],desc:'Os 5 números que cabem numa folha e fazem a reunião de segunda durar 20 minutos. Com o modelo de painel para baixar.'},
   {id:'s3',h:'11:30',dur:90,t:'Workshop T3 Manager: liderança que executa',spk:'Equipe T3 Manager',role:'Capacitação de gestores',av:'TM',c:C.sand,room:'workshops',track:'Workshops',vagas:12,tags:['Liderança','Prático'],desc:'Mão na massa: rituais de gestão, feedback e metas para o seu time de líderes. Vagas limitadas.'},
   {id:'s4',h:'14:00',dur:50,t:'Vender mais sem baixar preço: o jogo do ticket médio',spk:'Juliana Lacerda',role:'CEO · Rede varejista, 42 lojas',av:'JL',c:C.rose,room:'palco',track:'Palco Liga',tags:['Vendas','Varejo'],desc:'Como uma rede do interior aumentou 31% o ticket médio em 12 meses revendo mix, vitrine e comissão da equipe. Casos da região, sem fórmula de capital.'},
   {id:'s5',h:'15:00',dur:90,t:'Lounge de Negócios: rodadas de conexão',room:'lounge',track:'Networking',tags:['Networking'],desc:'Reuniões de 20 minutos marcadas pelo app, com mesa reservada.'},
   {id:'s6',h:'16:30',dur:60,t:'Painel: crescer no interior sem perder a margem',spk:'3 convidados',role:'Agro, saúde e indústria',av:'+3',c:C.slate,room:'palco',track:'Palco Liga',tags:['Crescimento'],desc:'Três empresários da região, três setores, uma pergunta: como crescer sem queimar caixa.'},
   {id:'s7',h:'20:00',dur:180,t:'Jantar de abertura',room:'externo',track:'Networking',desc:'Local divulgado no app às 18h. Transfer saindo dos hotéis parceiros.'} ],
 [ {id:'d1',h:'08:30',dur:60,t:'Café com conselheiros',room:'lounge',track:'Networking',desc:'Mesas temáticas com conselheiros do Hub.'},
   {id:'d2',h:'09:30',dur:60,t:'Sucessão sem trauma: a empresa depois do fundador',spk:'Marcos Teixeira',role:'Advogado societário',av:'MT',c:C.slate,room:'palco',track:'Palco Liga',tags:['Governança'],desc:'Acordo de sócios, conselho e o que fazer antes de precisar.'},
   {id:'d3',h:'11:00',dur:50,t:'IA no chão da empresa: 5 usos que pagam a conta',spk:'Paula Rocha',role:'Diretora de Tecnologia',av:'PR',c:C.lilac,room:'gestao',track:'Sala Gestão',tags:['Tecnologia','IA'],desc:'Atendimento, cobrança, compras, RH e financeiro: o que já funciona em empresa média.'},
   {id:'d4',h:'14:00',dur:120,t:'Visita técnica: centro de distribuição',room:'externo',track:'Workshops',vagas:30,tags:['Missão'],desc:'Saída do evento às 13h40 em ônibus do evento.'} ],
 [ {id:'t1',h:'09:00',dur:60,t:'O ano que vem começa hoje: plano de 90 dias',spk:'Rafael Andrade',role:'Fundador · T3 Hub',av:'RA',c:C.gold,room:'palco',track:'Palco Liga',tags:['Execução'],desc:'Fechamento com o plano de 90 dias para aplicar na segunda-feira.'},
   {id:'t2',h:'11:00',dur:60,t:'Premiação da Liga T3',room:'palco',track:'Palco Liga',desc:'Os participantes com mais pontos sobem ao palco.'} ]
];
const ROOMS={palco:'Palco Liga',gestao:'Sala Gestão',vendas:'Sala Vendas',workshops:'Workshops',lounge:'Lounge de Negócios',cafe:'Café',estandes:'Estandes',foyer:'Foyer',externo:'Fora do pavilhão'};
const PEOPLE={
 ps:{n:'Pedro Salles',r:'Diretor · Agro Norte Máquinas',seg:'Agro',fat:'5M a 15M',av:'PS',c:C.sage,pct:92,city:'Bocaiúva · MG',member:true,why:'Busca <b>parceiro de tecnologia</b> para rastrear frota. Você oferece software de gestão.',busca:['Tecnologia para frota','Fornecedores B2B','Sócio investidor'],oferece:['Revenda de máquinas','Rede no agro do Norte de MG']},
 av:{n:'Ana Vieira',r:'CEO · Clínica Vida+',seg:'Saúde',fat:'1M a 5M',av:'AV',c:C.lilac,pct:87,city:'Montes Claros · MG',member:false,why:'Vocês dois salvaram <b>Gestão à vista</b> e buscam sócios.',busca:['Sócios','Gestão financeira'],oferece:['Rede de clínicas','Parcerias em saúde corporativa']},
 lm:{n:'Lucas Moreira',r:'Fundador · Construtora LM',seg:'Construção',fat:'15M+',av:'LM',c:C.sky,pct:81,city:'Janaúba · MG',member:true,why:'Procura <b>software de obras</b>. Mesmo público B2B que o seu.',busca:['Tecnologia','Investidores'],oferece:['Obras corporativas','Terrenos na região']},
 bc:{n:'Beatriz Costa',r:'Sócia · Costa Distribuidora',seg:'Varejo',fat:'5M a 15M',av:'BC',c:C.rose,pct:78,city:'Pirapora · MG',member:false,why:'Quer <b>clientes B2B</b> em Montes Claros, onde você atua.',busca:['Clientes B2B','Logística'],oferece:['Distribuição no Norte de MG']}
};
const MISSIONS=[
 {k:'checkin',t:'Fazer check-in no evento',p:100,d:true},
 {k:'cartao',t:'Trocar cartão com 3 pessoas',p:150,d:true},
 {k:'estande',t:'Carimbar 5 estandes no passaporte',p:200,prog:1},
 {k:'pergunta',t:'Fazer uma pergunta ao vivo',p:50},
 {k:'reuniao',t:'Marcar uma reunião',p:100},
 {k:'enquete',t:'Votar numa enquete',p:30}
];
const RANK=[['Mariana Prado','MP',C.lilac,1180],['Pedro Salles','PS',C.sage,1020],['Lucas Moreira','LM',C.sky,940]];
const PAY={plano:'Passaporte Premium',total:2970,forma:'Boleto parcelado em 3x',parcelas:[
 {n:1,v:990,venc:'15/03/2027',st:'paid',via:'Pix',pagoEm:'14/03/2027 · 18:42',id:'E18236120202703142142s0a9K'},
 {n:2,v:990,venc:'15/05/2027',st:'open',via:'Boleto',emitido:'15/04/2027',linha:'34191.79001 01043.510047 91020.150008 8 10450000099000'},
 {n:3,v:990,venc:'15/06/2027',st:'fut',via:'Boleto',emissao:'15/05/2027'}
]};
const SPONS=[['AGRO NORTE','#0f2238','#cfe0f3'],['ZONTIX','#16130d','#D4C08E'],['VIDA+','#1d0f1d','#e3b6e8'],['COSTA','#201010','#f1b9a6'],['LM OBRAS','#0e1a12','#b7d9a7']];
const PHOTOS=['f8','f3','f6','f2','f5','f7','f1','f4','f3','f6','f8','f2'];
// Passaporte de estandes (patrocinadores fictícios, exceto Zontix)
const STANDS=[
 {id:'agro',n:'Agro Norte Máquinas',short:'AGRO',booth:12,tier:'Ouro',seg:'Máquinas agrícolas',bg:'#0f2238',fg:'#cfe0f3',site:'agronorte.com.br',desc:'Revenda e assistência técnica de máquinas agrícolas no Norte de Minas, com oficina móvel que vai até a fazenda.',oferta:'Diagnóstico de frota grátis para participantes',x:166,y:314},
 {id:'zontix',n:'Zontix',short:'ZONTIX',booth:7,tier:'Ouro',seg:'Sistemas de gestão',bg:'#4955F9',fg:'#ffffff',site:'zontix.com.br',desc:'Sistemas de gestão com a cara do seu negócio: ERPs e CRMs prontos para o seu nicho ou feitos sob medida, com IA aplicada.',oferta:'Diagnóstico de processos em 30 minutos, no estande',x:82,y:314},
 {id:'vida',n:'Clínica Vida+',short:'VIDA+',booth:3,tier:'Prata',seg:'Saúde corporativa',bg:'#1d0f1d',fg:'#e3b6e8',site:'clinicavidamais.com.br',desc:'Saúde ocupacional e planos de bem-estar para equipes de empresas da região.',oferta:'Check-up express grátis no estande',x:40,y:268},
 {id:'costa',n:'Costa Distribuidora',short:'COSTA',booth:5,tier:'Prata',seg:'Distribuição',bg:'#201010',fg:'#f1b9a6',site:'costadistribuidora.com.br',desc:'Distribuição de bebidas e alimentos para mais de 80 municípios do Norte de Minas.',oferta:'Condição especial para pedidos fechados no evento',x:82,y:268},
 {id:'lm',n:'LM Obras',short:'LM',booth:9,tier:'Prata',seg:'Construção',bg:'#0e1a12',fg:'#b7d9a7',site:'lmobras.com.br',desc:'Obras corporativas e galpões logísticos com prazo contratual.',oferta:'Estudo de viabilidade sem custo',x:124,y:268},
 {id:'credi',n:'Credinorte',short:'CREDI',booth:10,tier:'Prata',seg:'Cooperativa de crédito',bg:'#13202a',fg:'#9fd3e6',site:'credinorte.coop.br',desc:'Cooperativa de crédito para empresas: capital de giro, antecipação e investimento.',oferta:'Simulação de crédito na hora',x:166,y:268},
 {id:'prisma',n:'Prisma Seguros',short:'PRISMA',booth:4,tier:'Bronze',seg:'Seguros empresariais',bg:'#1c1a10',fg:'#e8d79a',site:'prismaseguros.com.br',desc:'Seguro de frota, patrimônio e responsabilidade civil para empresas médias.',oferta:'Cotação de frota em 10 minutos',x:40,y:314},
 {id:'exata',n:'Exata Contábil',short:'EXATA',booth:8,tier:'Bronze',seg:'Contabilidade',bg:'#161616',fg:'#d0d0d0',site:'exatacontabil.com.br',desc:'Contabilidade consultiva e planejamento tributário para empresas no lucro real e presumido.',oferta:'Revisão tributária gratuita',x:124,y:314}
];
const REWARDS=[{n:5,s:'o brinde',t:'Brinde T3 Experience',d:'Retire no balcão T3 com o QR do passaporte'},{n:8,s:'o sorteio',t:'Sorteio do jantar com palestrantes',d:'Passaporte completo concorre no encerramento'}];
