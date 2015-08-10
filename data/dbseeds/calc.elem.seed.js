var qMeta = require(__dirname + '/../metadata/quandl/quandl');


exports.seedDB = function(){
  var Calc = require('mongoose').model('Calc');

  /** check whether DB.calcs is actually empty */
  Calc.find({}, function(err, calcs) {
    if (err) {
      return next(err);
    } else {
      if(calcs.length === 0){
        console.log('Seeding DB.calcs');
        seeder();
      } else {
        console.log('DB.calcs already contains data');
      }
    }
  });

};



function seeder() {
  var Calc = require('mongoose').model('Calc');

  /**
   * SEED BOERSE-OPTIONS
   **/
  var options = new Calc({
    name: 'options',
    id: 'boerse-options',
    designation: 'Optionspreisrechner',
    description: 'Mit dem Optionspreisrechner kannst du Preise und Parameter für Put- und Call-Optionen auf Aktien nach dem Black-Scholes-Modell bestimmen.',
    inputs: [
      {
        name: 'optiontype',
        id: 'boerse-options-optiontype',
        label: 'Art der Option',
        placeholder: 'Art der Option',
        tooltip: 'Gebe hier ein, ob die Parameter für eine Call- oder Put-Option berechnet werden sollen. Eine Call-Option (Kaufoption) räumt dem Käufer das Recht ein, eine oder mehrere Aktien zu einem vorher vereinbarten Preis (Basispreis/Strike) zu kaufen. Eine Put-Option (Verkaufsoption) räumt dem Käufer das Recht ein, eine oder mehrere Aktien zu einem vorher vereinbarten Preis (Basispreis/Strike) zu verkaufen.',
        type: 'select',
        vtype: 'number',
        args: [1, 2],
        options: [
          {
            id: '1',
            description: 'Call-Option'
          },
          {
            id: '2',
            description: 'Put-Option'
          }
        ]
      },
      {
        name: 'price',
        id: 'boerse-options-price',
        label: 'Preis der Aktie',
        placeholder: 'Preis der Aktie',
        tooltip: 'Gebe hier den Preis der Aktien bzw. des Underlyings ein.',
        addon: 'EUR',
        value: '50.00',
        type: 'number',
        vtype: 'number',
        args: [0, 1000000000]
      },
      {
        name: 'strike',
        id: 'boerse-options-strike',
        label: 'Basispreis/Strike',
        addon: 'EUR',
        placeholder: 'Strike/Basispreis',
        value: '50.00',
        tooltip: 'Gebe hier Basispreis (Strike, Ausübungspreis) der Option ein. Der Basispreis bezeichnet den Preis, zu dem man am Ausübungsdatum die Aktie kaufen (Call-Option) oder verkaufen (Put-Option) kann.',
        type: 'number',
        vtype: 'number',
        args: [0, 1000000000]
      },
      {
        name: 'interest',
        id: 'boerse-options-interest',
        label: 'Zinssatz',
        addon: '%',
        placeholder: 'Zinssatz',
        value: '3.00',
        tooltip: 'Gebe hier den annualisierten risikolosen Zinssatz in % an.',
        type: 'number',
        vtype: 'number',
        args: [0, 1000]
      },
      {
        name: 'maturity',
        id: 'boerse-options-maturity',
        label: 'Restlaufzeit der Option',
        addon: 'Tage',
        placeholder: 'Restlaufzeit in Tagen',
        value: '60',
        tooltip: 'Gebe hier die Restlaufzeit der Option in Tagen an.',
        type: 'number',
        vtype: 'number',
        args: [0, 100000]
      },
      {
        name: 'vola',
        id: 'boerse-options-vola',
        label: 'Volatilität',
        addon: '%',
        placeholder: 'Volatilität',
        value: '12.00',
        tooltip: 'Gebe hier die annualisierte Volatilität der Aktie bzw. des Underlyings an.',
        type: 'number',
        vtype: 'number',
        args: [0, 1000]
      }
    ],
    results_1: [
      {
        name: 'value',
        description: 'Theoretischer Optionspreis',
        unit: 'EUR',
        digits: 4,
        importance: 'first',
        tooltip: 'Der theoretische Optionspreis ist der Modellpreis der Option berechnet auf Basis des Black-Scholes-Optionspreismodells. Der theoretische Optionspreis kann vom Marktpreis abweichen, da der Marktpreis durch Angebot und Nachfrage am Optionsmarkt bestimmt wird. Allerdings ist der theoretische Preis meist - abgesehen von geringen Abweichungen - identisch dem Marktpreis. Lediglich bei selten gehandelten illiquiden Produkten können nennenswerte Abweichungen entstehen.'
      },
      {
        name: 'delta',
        description: 'Delta',
        unit: '',
        digits: 4,
        importance: 'first',
        tooltip: 'Das Optionsdelta beschreibt die Veränderung des Optionspreises im Verhältnis zur Veränderung des Preises der Aktie. Für eine Call-Option zum Beispiel bedeutet ein Delta von 0,5, dass bei einer Preissteigerung der Aktie der Optionspreis um 50% des Preises der Aktie steigt. Steigt die Aktie also um 0,10€, so steigt der Wert der Option um 0,05€. Für Put-Optionen, welche negative Deltas haben, kehrt sich dieses Verhältnis entsprechend um. Eine Put-Option mit Delta von -0,5 fällt um 0,05€ im Wert, wenn die Aktien um 0,10€ steigt. Mathematisch entspricht Delta der ersten Ableitung des Optionspreises nach dem Preis der Aktie.'
      },
      {
        name: 'gamma',
        description: 'Gamma',
        unit: '',
        digits: 4,
        importance: 'first',
        tooltip: 'Gamma beschreibt die Veränderung des Optionsdeltas im Verhältnis zur Veränderung des Preises der Aktie. Gamma ist ein wichtiges Maß der Konvexität des Wertes einer Option im Verhältnis zum Wert der Aktie. Mathematisch entspricht Gamma der zweiten Ableitung des theoretischen Optionspreises nach dem Aktienpreis bzw. der ersten Ableitung des Deltas nach dem Aktienpreis. In Delta-Hedging-Strategien wird Gamma häufig genutzt, um ein lineares Hedging über ein großes Preisintervall zu erzielen. Gamma ist vergleichsweise klein, wenn die Option weit im oder aus dem Geld ist. Am größten ist Gamma, wenn die Option nahe Geld ist (d.h. der Strike-Preis dem Aktienpreis entspricht).'
      },
      {
        name: 'theta',
        description: 'Theta',
        unit: '',
        digits: 4,
        importance: 'first',
        tooltip: 'Theta ist ein Maß für die Veränderung (Verringerung) des Optionswertes über die Zeit, oft auch bezeichnet als Zeitwertverfall. Ceteris paribus wird eine Option an Wert verlieren, wenn sie dem Verfallsdatum näher kommt. Daher ist Theta immer negativ. Eine Option mit einem aktuellen Theta von -0,10 wird mit Ablauf eines Tages 0,10€ an Wert verlieren. Theta reflekiert das Optionsrisiko begründet durch den Ablauf der Zeit, bzw. das Risiko reultierend aus dem schwindenden Zeitfenster für die Ausübung der Option.'
      },
      {
        name: 'vega',
        description: 'Vega',
        unit: '',
        digits: 4,
        importance: 'first',
        tooltip: 'Vega misst die Sensitivität des Optionspreises im Verhältnis zum Preis der Aktie. Es repräsentiert die Veränderung des Optionspreises bei einer 1%-tigen Veränderung der Volatilität der Aktie. Die Volatilität einer Aktie misst allgemein Größe und Häufigkeit von Preisänderungen. Vega steigt in Phasen hoher Marktvolatilität und fällt mit der Restlaufzeit der Option.'
      },
      {
        name: 'rho',
        description: 'Rho',
        unit: '',
        digits: 4,
        importance: 'first',
        tooltip: 'Rho ist ein Maß für die Sensitivität des Preises der Option im Verhältnis zu Zinsänderungen. Für eine Option mit Rho von 0,1 gilt, dass der Optionspreis um 0,10€ steigt, wenn der Zinssatz um einen Prozentpunkt steigt.'
      },
      {
        name: 'intrinsicValue',
        description: 'Innerer Wert',
        unit: 'EUR',
        digits: 4,
        importance: 'first',
        tooltip: 'Der innere Wert ist der Teil des Optionswertes, welcher alleine auf die Abweichung zwischen Preis der Aktie und Strike zurückzuführen ist (und nicht auf die Zeit). Für eine Call-Option entspricht der innere Wert dem Maximum aus der Differenz von Preis minus Strike und null. Für eine Put-Option dagegen entspricht der innere Wert dem Maximum aus der Differenz von Strike minus Preis und Null.'
      },
      {
        name: 'timeValue',
        description: 'Zeitwert',
        unit: 'EUR',
        digits: 4,
        importance: 'first',
        tooltip: 'Der Zeitwert ist der Teil des Optionswertes, welcher nicht auf den inneren Wert zuruckzuführen ist. Der Zeitwert wird beeinflusst von der Restlaufzeit, dem Zinssatz, dem aktuellem Kurs der Aktie sowie der Volatilität des Basiswerts. Mit dem Ablauf der Option konvergiert der Zeitwert zu null, die Option verliert mit Zeitablauf also stetig an Wert. Je mehr sich die Option dem Laufzeitende nähert, um so stärker nimmt der Zeitwert ab. Mit der Annäherung an das Laufzeitende nimmt auch die Wahrscheinlichkeit ab, dass es zu einer günstigen Entwicklung des Basistitels kommt. Da die Chance auf einen Gewinn abnimmt, haben Optionen mit einer geringen Laufzeit bei gleichem Basiswert und gleichem Basispreis in der Regel niedrigere Zeitwerte als solche mit einer längeren Laufzeit.Eine Abnahme des Zeitwerts kann nur durch eine Preissteigerung (Call) oder einen Preisverfall (Put) ausgeglichen werden. Am Laufzeitende entspricht der Optionswert nur noch dem inneren Wert, während er vor dem Laufzeitende der Summe aus innerem Wert und Zeitwert entspricht.'
      }
    ]
  });


  options.save(function (err) {
    if (err) {
      console.log(err);
      console.log('Seed Failed for Calc.Elem.Model.Options');
      return next(err);
    } else {
      console.log('Calc.Elem.Model.Options successfully seeded');
    }
  });


  /**
   * SEED BOERSE-FX
   * */
  var fx = new Calc({
    name: 'fx',
    id: 'boerse-fx',
    designation: 'Währungsrechner',
    description: 'Mit dem Währungsrechner kannst du beliebige Beträge in die verschiedensten Währungen umrechnen. Der Währungsrechner nutzt tagesaktuelle Kurse und erstellt eine praktische Umrechnungstabelle.',
    inputs: [
      {
        name: 'from',
        id: 'boerse-fx-from',
        label: 'Ausgangswährung',
        placeholder: 'Ausgangswährung',
        tooltip: 'Dies ist die Währungseinheit des Betrages, welcher umgerechnet werden soll. Falls du Geld umtauschen möchtest entspricht die Ausgangswährung die Währung in deinem Besitz.',
        type: 'select',
        vtype: 'string',
        options: [
          {
            id: 'Favoriten',
            description: '_OPTGROUP'
          },
          {
            id: 'EUR',
            description: 'Euro - EUR'
          },
          {
            id: 'USD ',
            description: 'US Dollar - USD'
          },
          {
            id: 'GBP ',
            description: 'Britisches Pfund - GBP'
          },
          {
            id: 'CNY ',
            description: 'Chinesischer Renminbi Yuan - CNY'
          },
          {
            id: 'CAD ',
            description: 'Kanadischer Dollar - CAD'
          },
          {
            id: 'AUD ',
            description: 'Australischer Dollar - AUD'
          },
          {
            id: 'A',
            description: '_OPTGROUP'
          },
          {
            id: 'EGP',
            description: 'Ägyptisches Pfund - EGP'
          },
          {
            id: 'ALL',
            description: 'Albanischer Lek - ALL'
          },
          {
            id: 'DZD',
            description: 'Algerischer Dinar - DZD'
          },
          {
            id: 'AOA',
            description: 'Angolanischer Kwanza - AOA'
          },
          {
            id: 'ARS',
            description: 'Argentinischer Peso - ARS'
          },
          {
            id: 'AMD',
            description: 'Armenischer Dram - AMD'
          },
          {
            id: 'AWG',
            description: 'Aruba Florin - AWG'
          },
          {
            id: 'AZN',
            description: 'Aserbaidschanischer Neuer Manat - AZN'
          },
          {
            id: 'ETB',
            description: 'Äthiopischer Birr - ETB'
          },
          {
            id: 'AUD',
            description: 'Australischer Dollar - AUD'
          },
          {
            id: 'B',
            description: '_OPTGROUP'
          },
          {
            id: 'BSD',
            description: 'Bahama-Dollar - BSD'
          },
          {
            id: 'BHD',
            description: 'Bahrain-Dinar - BHD'
          },
          {
            id: 'BDT',
            description: 'Bangladeschischer Taka - BDT'
          },
          {
            id:'BBD',
            description: 'Barbados-Dollar - BBD'
          },
          {
            id: 'BZD',
            description: 'Belize-Dollar - BZD'
          },
          {
            id: 'BMD',
            description: 'Bermuda-Dollar - BMD'
          },
          {
            id: 'BTN',
            description: 'Bhutanischer Ngultrum - BTN'
          },
          {
            id: 'BTC',
            description: 'Bitcoin - BTC'
          },
          {
            id: 'BOB',
            description: 'Bolivianischer Boliviano - BOB'
          },
          {
            id: 'BAM',
            description: 'Bosnisch Mark - BAM'
          },
          {
            id: 'BWP',
            description: 'Botsuanischer Pula - BWP'
          },
          {
            id: 'BRL',
            description: 'Brasilianischer Real - BRL'
          },
          {
            id: 'GBP',
            description: 'Britisches Pfund - GBP'
          },
          {
            id: 'BND',
            description: 'Brunei-Dollar - BND'
          },
          {
            id:'BGN',
            description: 'Bulgarischer Lev - BGN'
          },
          {
            id: 'BIF',
            description: 'Burundi-Franc - BIF'
          },
          {
            id: 'C',
            description: '_OPTGROUP'
          },
          {
            id: 'XOF',
            description: 'CFA Franc BCEAO - XOF'
          },
          {
            id: 'XAF',
            description: 'CFA Franc BEAC - XAF'
          },
          {
            id: 'CLP',
            description: 'Chilenischer Peso - CLP'
          },
          {
            id: 'CNY',
            description: 'Chinesischer Renminbi Yuan - CNY'
          },
          {
            id: 'CRC',
            description: 'Costa-Rica-Colón - CRC'
          },
          {
            id: 'D',
            description: '_OPTGROUP'
          },
          {
            id: 'DOP',
            description: 'Dominikanischer Peso - DOP'
          },
          {
            id: 'DJF',
            description: 'Dschibuti-Franc - DJF'
          },
          {
            id: 'DKK',
            description: 'Dänsiche Krone - DKK'
          },
          {
            id: 'E',
            description: '_OPTGROUP'
          },
          {
            id: 'XCD',
            description: 'East Caribeean Dollar - XCD'
          },
          {
            id: 'ERN',
            description: 'Eritreischer Nakfa - ERN'
          },
          {
            id: 'EUR',
            description: 'Euro - EUR'
          },
          {
            id: 'F',
            description: '_OPTGROUP'
          },
          {
            id: 'FKP',
            description: 'Falkland-Pfund - FKP'
          },
          {
            id: 'FJD',
            description: 'Fidschi-Dollar - FJD'
          },
          {
            id: 'G',
            description: '_OPTGROUP'
          },
          {
            id: 'GMD',
            description: 'Gambischer Dalasi - GMD'
          },
          {
            id: 'GEL',
            description: 'Georgischer Lari - GEL'
          },
          {
            id: 'GHS',
            description: 'Ghanaischer Neuer Cedi - GHS'
          },
          {
            id: 'GIP',
            description: 'Gibraltar-Pfund - GIP'
          },
          {
            id: 'XAU',
            description: 'Gold - XAU'
          },
          {
            id: 'GTQ',
            description: 'Guatemaltekischer Quetzal - GTQ'
          },
          {
            id: 'GNF',
            description: 'Guinea-Franc - GNF'
          },
          {
            id: 'GYD',
            description: 'Guyana-Dollar - GYD'
          },
          {
            id: 'H',
            description: '_OPTGROUP'
          },
          {
            id: 'HTG',
            description: 'Haitianische Gourde - HTG'
          },
          {
            id: 'HNL',
            description: 'Honduranische Lempira - HNL'
          },
          {
            id: 'HKD',
            description: 'Honkong-Dollar - HKD'
          },
          {
            id: 'I',
            description: '_OPTGROUP'
          },
          {
            id: 'INR',
            description: 'Indische Rupie - INR'
          },
          {
            id: 'IDR',
            description: 'Indonesische Rupiah - IDR'
          },
          {
            id: 'IQD',
            description: 'Irakischer Dinar - IQD'
          },
          {
            id: 'IRR',
            description: 'Iranischer Rial - IRR'
          },
          {
            id: 'ISK',
            description: 'Isländische Krone - ISK'
          },
          {
            id: 'J',
            description: '_OPTGROUP'
          },
          {
            id: 'JMD',
            description: 'Jamaikanischer Dollar - JMD'
          },
          {
            id: 'JPY',
            description: 'Japanischer Yen - JPY'
          },
          {
            id: 'JOD',
            description: 'Jordanischer Dinar - JOD'
          },
          {
            id: 'K',
            description: '_OPTGROUP'
          },
          {
            id: 'KYD',
            description: 'Kaiman-Dollar - KYD'
          },
          {
            id: 'KHR',
            description: 'Kambodschanischer Rial - KHR'
          },
          {
            id: 'CAD',
            description: 'Kanadischer Dollar - CAD'
          },
          {
            id: 'CVE',
            description: 'Kap-Verde-Escudo - CVE'
          },
          {
            id: 'KZT',
            description: 'Kasachstan Tenge - KZT'
          },
          {
            id: 'QAR',
            description: 'Katar-Rial - QAR'
          },
          {
            id: 'KES',
            description: 'Kenianischer Schilling - KES'
          },
          {
            id: 'KGS',
            description: 'Kirgisistan-Som - KGS'
          },
          {
            id: 'COP',
            description: 'Kolumbianischer Peso - COP'
          },
          {
            id: 'KMF',
            description: 'Komoren-Franc - KMF'
          },
          {
            id: 'CDF',
            description: 'Kongo-Franc - CDF'
          },
          {
            id: 'HRK',
            description: 'Kroatische Kuna - HRK'
          },
          {
            id: 'CUC',
            description: 'Kubanischer umwandelbarer Peso - CUC'
          },
          {
            id: 'KWD',
            description: 'Kuwaitischer Dinar - KWD'
          },
          {
            id: 'L',
            description: '_OPTGROUP'
          },
          {
            id: 'LAK',
            description: 'Laotischer Kip - LAK'
          },
          {
            id: 'LSL',
            description: 'Lesothischer Loti - LSL'
          },
          {
            id: 'LVL',
            description: 'Lettische Lats - LVL'
          },
          {
            id: 'LBP',
            description: 'Libanesisches Pfund - LBP'
          },
          {
            id: 'LRD',
            description: 'Liberianischer Dollar - LRD'
          },
          {
            id: 'LYD',
            description: 'Libyscher Dinar - LYD'
          },
          {
            id: 'LTL',
            description: 'Litauische Litas - LTL'
          },
          {
            id: 'M',
            description: '_OPTGROUP'
          },
          {
            id: 'MOP',
            description: 'Macauische Pataca - MOP'
          },
          {
            id: 'MGA',
            description: 'Madagascar-Ariary - MGA'
          },
          {
            id: 'MWK',
            description: 'Malawi-Kwacha - MWK'
          },
          {
            id: 'MYR',
            description: 'Malaysischer Ringgit - MYR'
          },
          {
            id: 'MVR',
            description: 'Maledivische Rufiyaa - MVR'
          },
          {
            id: 'MAD',
            description: 'Marokkanischer Dirham - MAD'
          },
          {
            id: 'MRO',
            description: 'Mauretanische Ouguiya - MRO'
          },
          {
            id: 'MUR',
            description: 'Mauritius-Rupie - MUR'
          },
          {
            id: 'MKD',
            description: 'Mazedonischer Denar - MKD'
          },
          {
            id: 'MXN',
            description: 'Mexikanischer Peso - MXN'
          },
          {
            id: 'MDL',
            description: 'Moldauischer Leu - MDL'
          },
          {
            id: 'MNT',
            description: 'Mongolischer Tugrik - MNT'
          },
          {
            id: 'MZN',
            description: 'Mosamnikanischer Neuer Metical - MZN'
          },
          {
            id: 'MMK',
            description: 'Myanmarischer Kyat - MMK'
          },
          {
            id: 'N',
            description: '_OPTGROUP'
          },
          {
            id: 'NAD',
            description: 'Namibischer Dollar - NAD'
          },
          {
            id: 'NPR',
            description: 'Nepalesische Rupie - NPR'
          },
          {
            id: 'NZD',
            description: 'Neuseeländischer Dollar - NZD'
          },
          {
            id: 'NIO',
            description: 'Nicaraguanischer Córdoba - NIO'
          },
          {
            id: 'NGN',
            description: 'Nigerianische Naira - NGN'
          },
          {
            id: 'ANG',
            description: 'NL-Antillen-Gulden - ANG'
          },
          {
            id: 'NOK',
            description: 'Norwegische Krone - NOK'
          },
          {
            id: 'O',
            description: '_OPTGROUP'
          },
          {
            id: 'OMR',
            description: 'Omani Rial - OMR'
          },
          {
            id: 'P',
            description: '_OPTGROUP'
          },
          { id: 'PKR',
            description: 'Pakistanische Rupie - PKR'
          },
          { id: 'PAB',
            description: 'Panamaischer Balboa - PAB'
          },
          {
            id: 'PGK',
            description: 'Papua-Neuginea-Kina - PGK'
          },
          {
            id: 'PYG',
            description: 'Paraguayischer Guarani - PYG'
          },
          {
            id: 'PEN',
            description: 'Peruanischer Sol - PEN'
          },
          {
            id: 'PHP',
            description: 'Philippinischer Peso - PHP'
          },
          {
            id: 'PLN',
            description: 'Polnischer Zloty - PLN'
          },
          {
            id: 'R',
            description: '_OPTGROUP'
          },
          {
            id: 'RWF',
            description: 'Ruanda-Franc - RWF'
          },
          {
            id: 'RON',
            description: 'Rumänischer Neue Lei - RON'
          },
          {
            id: 'RUB',
            description: 'Russischer Rubel - RUB'
          },
          {
            id: 'S',
            description: '_OPTGROUP'
          },
          {
            id: 'SBD',
            description: 'Salomonen-Dollar - SBD'
          },
          {
            id: 'ZMW',
            description: 'Sambischer Kwacha - ZMW'
          },
          {
            id: 'WST',
            description: 'Samoanischer Tala - WST'
          },
          {
            id: 'SAR',
            description: 'Saudi Rial - SAR'
          },
          {
            id: 'SEK',
            description: 'Schwedische Krone - SEK'
          },
          {
            id: 'CHF',
            description: 'Schweizer Franken - CHF'
          },
          {
            id: 'RSD',
            description: 'Serbischer Dinar - RSD'
          },
          {
            id: 'SCR',
            description: 'Seychellen-Rupie - SCR'
          },
          {
            id: 'SLL',
            description: 'Sierraleonische Leone - SLL'
          },
          {
            id: 'XAG',
            description: 'Silber (Uz.) - XAG'
          },
          {
            id: 'SGD',
            description: 'Singapur-Dollar - SGD'
          },
          {
            id: 'SOS',
            description: 'Somalischer Schilling - SOS'
          },
          {
            id: 'LKR',
            description: 'Sri-Lanka-Rupie - LKR'
          },
          {
            id: 'SHP',
            description: 'St. Helena-Pfund - SHP'
          },
          {
            id: 'SDG',
            description: 'Sudanesisches Pfund - SDG'
          },
          {
            id: 'SRD',
            description: 'Suriname-Dollar - SRD'
          },
          {
            id: 'SZL',
            description: 'Swasiland Lilangeni - SZL'
          },
          {
            id: 'SYP',
            description: 'Syrisches Pfund - SYP'
          },
          {
            id: 'STD',
            description: 'São Tomé und Príncipe - STD'
          },
          {
            id: 'ZAR',
            description: 'Südafrikanischer Rand - ZAR'
          },
          {
            id: 'KRW',
            description: 'Südkoreansicher Won - KRW'
          },
          {
            id: 'T',
            description: '_OPTGROUP'
          },
          {
            id: 'TJS',
            description: 'Tadschikistan Somoni - TJS'
          },
          {
            id: 'TWD',
            description: 'Taiwanesicher Dollar - TWD'
          },
          {
            id: 'TZS',
            description: 'Tansania-Schilling - TZS'
          },
          {
            id: 'THB',
            description: 'Thailändischer Baht - THB'
          },
          { id: 'TOP',
            description: 'Tongaische PaAnga - TOP'
          },
          {
            id: 'TTD',
            description: 'Trinidad/Tobago-Dollar - TTD'
          },
          {
            id: 'CZK',
            description: 'Tschechische Krone - CZK'
          },
          {
            id: 'TND',
            description: 'Tunesischer Dinar - TND'
          },
          {
            id: 'TRY',
            description: 'Türkische Lira - TRY'
          },
          {
            id: 'U',
            description: '_OPTGROUP'
          },
          {
            id: 'UGX',
            description: 'Uganda-Schilling - UGX'
          },
          {
            id: 'UAH',
            description: 'Ukrainische Griwna - UAH'
          },
          {
            id: 'HUF',
            description: 'Ungarischer Forint - HUF'
          },
          {
            id: 'UYU',
            description: 'Uruguayischer Peso - UYU'
          },
          {
            id: 'USD',
            description: 'US Dollar - USD'
          },
          {
            id: 'UZS',
            description: 'Uzbekischer Som - UZS'
          },
          {
            id: 'V',
            description: '_OPTGROUP'
          },
          {
            id: 'VUV',
            description: 'Vanuatu-Vatu - VUV'
          },
          {
            id: 'VEF',
            description: 'Venezuanischer Bolivar Fuerte - VEF'
          },
          {
            id: 'AED',
            description: 'Ver. Arab. Emir.-Dirham - AED'
          },
          {
            id: 'W',
            description: '_OPTGROUP'
          },
          {
            id: 'BYR',
            description: 'Weißrussischer Rubel - BYR'
          },
          {
            id: 'Y',
            description: '_OPTGROUP'
          },
          {
            id: 'YER',
            description: 'Yemen Rial - YER'
          },
          {
            id: 'Z',
            description: '_OPTGROUP'
          },
          {
            id: 'XPF',
            description: 'Zentraler Pazifischer Franc - XPF'
          }
        ]
      },
      {
        name: 'principal',
        id: 'boerse-fx-principal',
        label: 'Betrag',
        placeholder: 'Betrag',
        value: '100.00',
        tooltip: 'Gebe hier den Betrag in der Ausgangswährung ein. Falls du Geld umtauschen möchtest ist dies das umzutauschende Geld in deinem Besitz.',
        type: 'number',
        vtype: 'number',
        args: [0, 1000000000000]
      },
      {
        name: 'to',
        id: 'boerse-fx-to',
        label: 'Zielwährung',
        placeholder: 'Zielwährung',
        tooltip: 'Dies ist die Währungseinheit des Betrages, welchen du nach der Umrechnung bekommst. Beim Geldumtausch entspricht dies der Währung, welche du nach dem Umtausch haben möchtest.',
        type: 'select',
        vtype: 'string',
        options: [
          {
            id: 'Favoriten',
            description: '_OPTGROUP'
          },
          {
            id: 'EUR',
            description: 'Euro - EUR'
          },
          {
            id: 'USD ',
            description: 'US Dollar - USD'
          },
          {
            id: 'GBP ',
            description: 'Britisches Pfund - GBP'
          },
          {
            id: 'CNY ',
            description: 'Chinesischer Renminbi Yuan - CNY'
          },
          {
            id: 'CAD ',
            description: 'Kanadischer Dollar - CAD'
          },
          {
            id: 'AUD ',
            description: 'Australischer Dollar - AUD'
          },
          {
            id: 'A',
            description: '_OPTGROUP'
          },
          {
            id: 'EGP',
            description: 'Ägyptisches Pfund - EGP'
          },
          {
            id: 'ALL',
            description: 'Albanischer Lek - ALL'
          },
          {
            id: 'DZD',
            description: 'Algerischer Dinar - DZD'
          },
          {
            id: 'AOA',
            description: 'Angolanischer Kwanza - AOA'
          },
          {
            id: 'ARS',
            description: 'Argentinischer Peso - ARS'
          },
          {
            id: 'AMD',
            description: 'Armenischer Dram - AMD'
          },
          {
            id: 'AWG',
            description: 'Aruba Florin - AWG'
          },
          {
            id: 'AZN',
            description: 'Aserbaidschanischer Neuer Manat - AZN'
          },
          {
            id: 'ETB',
            description: 'Äthiopischer Birr - ETB'
          },
          {
            id: 'AUD',
            description: 'Australischer Dollar - AUD'
          },
          {
            id: 'B',
            description: '_OPTGROUP'
          },
          {
            id: 'BSD',
            description: 'Bahama-Dollar - BSD'
          },
          {
            id: 'BHD',
            description: 'Bahrain-Dinar - BHD'
          },
          {
            id: 'BDT',
            description: 'Bangladeschischer Taka - BDT'
          },
          {
            id:'BBD',
            description: 'Barbados-Dollar - BBD'
          },
          {
            id: 'BZD',
            description: 'Belize-Dollar - BZD'
          },
          {
            id: 'BMD',
            description: 'Bermuda-Dollar - BMD'
          },
          {
            id: 'BTN',
            description: 'Bhutanischer Ngultrum - BTN'
          },
          {
            id: 'BTC',
            description: 'Bitcoin - BTC'
          },
          {
            id: 'BOB',
            description: 'Bolivianischer Boliviano - BOB'
          },
          {
            id: 'BAM',
            description: 'Bosnisch Mark - BAM'
          },
          {
            id: 'BWP',
            description: 'Botsuanischer Pula - BWP'
          },
          {
            id: 'BRL',
            description: 'Brasilianischer Real - BRL'
          },
          {
            id: 'GBP',
            description: 'Britisches Pfund - GBP'
          },
          {
            id: 'BND',
            description: 'Brunei-Dollar - BND'
          },
          {
            id:'BGN',
            description: 'Bulgarischer Lev - BGN'
          },
          {
            id: 'BIF',
            description: 'Burundi-Franc - BIF'
          },
          {
            id: 'C',
            description: '_OPTGROUP'
          },
          {
            id: 'XOF',
            description: 'CFA Franc BCEAO - XOF'
          },
          {
            id: 'XAF',
            description: 'CFA Franc BEAC - XAF'
          },
          {
            id: 'CLP',
            description: 'Chilenischer Peso - CLP'
          },
          {
            id: 'CNY',
            description: 'Chinesischer Renminbi Yuan - CNY'
          },
          {
            id: 'CRC',
            description: 'Costa-Rica-Colón - CRC'
          },
          {
            id: 'D',
            description: '_OPTGROUP'
          },
          {
            id: 'DOP',
            description: 'Dominikanischer Peso - DOP'
          },
          {
            id: 'DJF',
            description: 'Dschibuti-Franc - DJF'
          },
          {
            id: 'DKK',
            description: 'Dänsiche Krone - DKK'
          },
          {
            id: 'E',
            description: '_OPTGROUP'
          },
          {
            id: 'XCD',
            description: 'East Caribeean Dollar - XCD'
          },
          {
            id: 'ERN',
            description: 'Eritreischer Nakfa - ERN'
          },
          {
            id: 'EUR',
            description: 'Euro - EUR'
          },
          {
            id: 'F',
            description: '_OPTGROUP'
          },
          {
            id: 'FKP',
            description: 'Falkland-Pfund - FKP'
          },
          {
            id: 'FJD',
            description: 'Fidschi-Dollar - FJD'
          },
          {
            id: 'G',
            description: '_OPTGROUP'
          },
          {
            id: 'GMD',
            description: 'Gambischer Dalasi - GMD'
          },
          {
            id: 'GEL',
            description: 'Georgischer Lari - GEL'
          },
          {
            id: 'GHS',
            description: 'Ghanaischer Neuer Cedi - GHS'
          },
          {
            id: 'GIP',
            description: 'Gibraltar-Pfund - GIP'
          },
          {
            id: 'XAU',
            description: 'Gold - XAU'
          },
          {
            id: 'GTQ',
            description: 'Guatemaltekischer Quetzal - GTQ'
          },
          {
            id: 'GNF',
            description: 'Guinea-Franc - GNF'
          },
          {
            id: 'GYD',
            description: 'Guyana-Dollar - GYD'
          },
          {
            id: 'H',
            description: '_OPTGROUP'
          },
          {
            id: 'HTG',
            description: 'Haitianische Gourde - HTG'
          },
          {
            id: 'HNL',
            description: 'Honduranische Lempira - HNL'
          },
          {
            id: 'HKD',
            description: 'Honkong-Dollar - HKD'
          },
          {
            id: 'I',
            description: '_OPTGROUP'
          },
          {
            id: 'INR',
            description: 'Indische Rupie - INR'
          },
          {
            id: 'IDR',
            description: 'Indonesische Rupiah - IDR'
          },
          {
            id: 'IQD',
            description: 'Irakischer Dinar - IQD'
          },
          {
            id: 'IRR',
            description: 'Iranischer Rial - IRR'
          },
          {
            id: 'ISK',
            description: 'Isländische Krone - ISK'
          },
          {
            id: 'J',
            description: '_OPTGROUP'
          },
          {
            id: 'JMD',
            description: 'Jamaikanischer Dollar - JMD'
          },
          {
            id: 'JPY',
            description: 'Japanischer Yen - JPY'
          },
          {
            id: 'JOD',
            description: 'Jordanischer Dinar - JOD'
          },
          {
            id: 'K',
            description: '_OPTGROUP'
          },
          {
            id: 'KYD',
            description: 'Kaiman-Dollar - KYD'
          },
          {
            id: 'KHR',
            description: 'Kambodschanischer Rial - KHR'
          },
          {
            id: 'CAD',
            description: 'Kanadischer Dollar - CAD'
          },
          {
            id: 'CVE',
            description: 'Kap-Verde-Escudo - CVE'
          },
          {
            id: 'KZT',
            description: 'Kasachstan Tenge - KZT'
          },
          {
            id: 'QAR',
            description: 'Katar-Rial - QAR'
          },
          {
            id: 'KES',
            description: 'Kenianischer Schilling - KES'
          },
          {
            id: 'KGS',
            description: 'Kirgisistan-Som - KGS'
          },
          {
            id: 'COP',
            description: 'Kolumbianischer Peso - COP'
          },
          {
            id: 'KMF',
            description: 'Komoren-Franc - KMF'
          },
          {
            id: 'CDF',
            description: 'Kongo-Franc - CDF'
          },
          {
            id: 'HRK',
            description: 'Kroatische Kuna - HRK'
          },
          {
            id: 'CUC',
            description: 'Kubanischer umwandelbarer Peso - CUC'
          },
          {
            id: 'KWD',
            description: 'Kuwaitischer Dinar - KWD'
          },
          {
            id: 'L',
            description: '_OPTGROUP'
          },
          {
            id: 'LAK',
            description: 'Laotischer Kip - LAK'
          },
          {
            id: 'LSL',
            description: 'Lesothischer Loti - LSL'
          },
          {
            id: 'LVL',
            description: 'Lettische Lats - LVL'
          },
          {
            id: 'LBP',
            description: 'Libanesisches Pfund - LBP'
          },
          {
            id: 'LRD',
            description: 'Liberianischer Dollar - LRD'
          },
          {
            id: 'LYD',
            description: 'Libyscher Dinar - LYD'
          },
          {
            id: 'LTL',
            description: 'Litauische Litas - LTL'
          },
          {
            id: 'M',
            description: '_OPTGROUP'
          },
          {
            id: 'MOP',
            description: 'Macauische Pataca - MOP'
          },
          {
            id: 'MGA',
            description: 'Madagascar-Ariary - MGA'
          },
          {
            id: 'MWK',
            description: 'Malawi-Kwacha - MWK'
          },
          {
            id: 'MYR',
            description: 'Malaysischer Ringgit - MYR'
          },
          {
            id: 'MVR',
            description: 'Maledivische Rufiyaa - MVR'
          },
          {
            id: 'MAD',
            description: 'Marokkanischer Dirham - MAD'
          },
          {
            id: 'MRO',
            description: 'Mauretanische Ouguiya - MRO'
          },
          {
            id: 'MUR',
            description: 'Mauritius-Rupie - MUR'
          },
          {
            id: 'MKD',
            description: 'Mazedonischer Denar - MKD'
          },
          {
            id: 'MXN',
            description: 'Mexikanischer Peso - MXN'
          },
          {
            id: 'MDL',
            description: 'Moldauischer Leu - MDL'
          },
          {
            id: 'MNT',
            description: 'Mongolischer Tugrik - MNT'
          },
          {
            id: 'MZN',
            description: 'Mosamnikanischer Neuer Metical - MZN'
          },
          {
            id: 'MMK',
            description: 'Myanmarischer Kyat - MMK'
          },
          {
            id: 'N',
            description: '_OPTGROUP'
          },
          {
            id: 'NAD',
            description: 'Namibischer Dollar - NAD'
          },
          {
            id: 'NPR',
            description: 'Nepalesische Rupie - NPR'
          },
          {
            id: 'NZD',
            description: 'Neuseeländischer Dollar - NZD'
          },
          {
            id: 'NIO',
            description: 'Nicaraguanischer Córdoba - NIO'
          },
          {
            id: 'NGN',
            description: 'Nigerianische Naira - NGN'
          },
          {
            id: 'ANG',
            description: 'NL-Antillen-Gulden - ANG'
          },
          {
            id: 'NOK',
            description: 'Norwegische Krone - NOK'
          },
          {
            id: 'O',
            description: '_OPTGROUP'
          },
          {
            id: 'OMR',
            description: 'Omani Rial - OMR'
          },
          {
            id: 'P',
            description: '_OPTGROUP'
          },
          { id: 'PKR',
            description: 'Pakistanische Rupie - PKR'
          },
          { id: 'PAB',
            description: 'Panamaischer Balboa - PAB'
          },
          {
            id: 'PGK',
            description: 'Papua-Neuginea-Kina - PGK'
          },
          {
            id: 'PYG',
            description: 'Paraguayischer Guarani - PYG'
          },
          {
            id: 'PEN',
            description: 'Peruanischer Sol - PEN'
          },
          {
            id: 'PHP',
            description: 'Philippinischer Peso - PHP'
          },
          {
            id: 'PLN',
            description: 'Polnischer Zloty - PLN'
          },
          {
            id: 'R',
            description: '_OPTGROUP'
          },
          {
            id: 'RWF',
            description: 'Ruanda-Franc - RWF'
          },
          {
            id: 'RON',
            description: 'Rumänischer Neue Lei - RON'
          },
          {
            id: 'RUB',
            description: 'Russischer Rubel - RUB'
          },
          {
            id: 'S',
            description: '_OPTGROUP'
          },
          {
            id: 'SBD',
            description: 'Salomonen-Dollar - SBD'
          },
          {
            id: 'ZMW',
            description: 'Sambischer Kwacha - ZMW'
          },
          {
            id: 'WST',
            description: 'Samoanischer Tala - WST'
          },
          {
            id: 'SAR',
            description: 'Saudi Rial - SAR'
          },
          {
            id: 'SEK',
            description: 'Schwedische Krone - SEK'
          },
          {
            id: 'CHF',
            description: 'Schweizer Franken - CHF'
          },
          {
            id: 'RSD',
            description: 'Serbischer Dinar - RSD'
          },
          {
            id: 'SCR',
            description: 'Seychellen-Rupie - SCR'
          },
          {
            id: 'SLL',
            description: 'Sierraleonische Leone - SLL'
          },
          {
            id: 'XAG',
            description: 'Silber (Uz.) - XAG'
          },
          {
            id: 'SGD',
            description: 'Singapur-Dollar - SGD'
          },
          {
            id: 'SOS',
            description: 'Somalischer Schilling - SOS'
          },
          {
            id: 'LKR',
            description: 'Sri-Lanka-Rupie - LKR'
          },
          {
            id: 'SHP',
            description: 'St. Helena-Pfund - SHP'
          },
          {
            id: 'SDG',
            description: 'Sudanesisches Pfund - SDG'
          },
          {
            id: 'SRD',
            description: 'Suriname-Dollar - SRD'
          },
          {
            id: 'SZL',
            description: 'Swasiland Lilangeni - SZL'
          },
          {
            id: 'SYP',
            description: 'Syrisches Pfund - SYP'
          },
          {
            id: 'STD',
            description: 'São Tomé und Príncipe - STD'
          },
          {
            id: 'ZAR',
            description: 'Südafrikanischer Rand - ZAR'
          },
          {
            id: 'KRW',
            description: 'Südkoreansicher Won - KRW'
          },
          {
            id: 'T',
            description: '_OPTGROUP'
          },
          {
            id: 'TJS',
            description: 'Tadschikistan Somoni - TJS'
          },
          {
            id: 'TWD',
            description: 'Taiwanesicher Dollar - TWD'
          },
          {
            id: 'TZS',
            description: 'Tansania-Schilling - TZS'
          },
          {
            id: 'THB',
            description: 'Thailändischer Baht - THB'
          },
          { id: 'TOP',
            description: 'Tongaische PaAnga - TOP'
          },
          {
            id: 'TTD',
            description: 'Trinidad/Tobago-Dollar - TTD'
          },
          {
            id: 'CZK',
            description: 'Tschechische Krone - CZK'
          },
          {
            id: 'TND',
            description: 'Tunesischer Dinar - TND'
          },
          {
            id: 'TRY',
            description: 'Türkische Lira - TRY'
          },
          {
            id: 'U',
            description: '_OPTGROUP'
          },
          {
            id: 'UGX',
            description: 'Uganda-Schilling - UGX'
          },
          {
            id: 'UAH',
            description: 'Ukrainische Griwna - UAH'
          },
          {
            id: 'HUF',
            description: 'Ungarischer Forint - HUF'
          },
          {
            id: 'UYU',
            description: 'Uruguayischer Peso - UYU'
          },
          {
            id: 'USD',
            description: 'US Dollar - USD'
          },
          {
            id: 'UZS',
            description: 'Uzbekischer Som - UZS'
          },
          {
            id: 'V',
            description: '_OPTGROUP'
          },
          {
            id: 'VUV',
            description: 'Vanuatu-Vatu - VUV'
          },
          {
            id: 'VEF',
            description: 'Venezuanischer Bolivar Fuerte - VEF'
          },
          {
            id: 'AED',
            description: 'Ver. Arab. Emir.-Dirham - AED'
          },
          {
            id: 'W',
            description: '_OPTGROUP'
          },
          {
            id: 'BYR',
            description: 'Weißrussischer Rubel - BYR'
          },
          {
            id: 'Y',
            description: '_OPTGROUP'
          },
          {
            id: 'YER',
            description: 'Yemen Rial - YER'
          },
          {
            id: 'Z',
            description: '_OPTGROUP'
          },
          {
            id: 'XPF',
            description: 'Zentraler Pazifischer Franc - XPF'
          }
        ]
      }
    ],

    results_1: [
      {
        name: 'value',
        description: 'Betrag in Zielwährung',
        digits: 2,
        importance: 'first',
        tooltip: 'Dieses Ergebnisfeld gibt den in die Zielwährung umgerechneten Betrag wieder. Beim Geldumtausch ist dies der Betrag, welchen du nach dem Umtausch in der Zielwährung zur Verfügung hast.'
      }]
  });


  fx.save(function (err) {
    if (err) {
      console.log(err);
      console.log('Seed Failed for Calc.Elem.Model.FX');
      return next(err);
    } else {
      console.log('Calc.Elem.Model.FX successfully seeded');
    }
  });



  /**
   * SEED BOERSE-EQUITYRETURN
   * */
  var equityreturn = new Calc({
    name: 'equityreturn',
    id: 'boerse-equityreturn',
    designation: 'Aktienrenditerechner',
    description: 'Mit dem Aktienrenditerechner kannst du die annualisierte Rendite (IRR) für Aktienanlagen bestimmen. Dabei können Dividendenzahlungen und Gebühren berücksichtigt werden.',
    inputs: [
      {
        name: 'quantity',
        id: 'boerse-equityreturn-quantity',
        label: 'Anzahl Aktien',
        addon: 'Stück',
        placeholder: 'Anzahl Aktien',
        value: '1',
        tooltip: 'Gebe hier die Gesamtzahl der gekauften Aktien ein.',
        type: 'number',
        vtype: 'number',
        args: [0,1000000000]
      },
      {
        name: 'buy',
        id: 'boerse-equityreturn-buy',
        label: 'Kaufkurs',
        addon: 'EUR',
        placeholder: 'Kaufkurs',
        value: '68.12',
        tooltip: 'Gebe hier den Kurs ein, zu welckem die Aktien gekauft worden sind.',
        type: 'number',
        vtype: 'number',
        args: [0, 1000000000]
      },
      {
        name: 'sell',
        id: 'boerse-equityreturn-sell',
        label: 'Verkaufskurs',
        addon: 'EUR',
        placeholder: 'Verkaufskurs',
        value: '92.65',
        tooltip: 'Gebe hier den Kurs ein, zu welchem die Aktien verkauft worden sind.',
        type: 'number',
        vtype: 'number',
        args: [0, 1000000000]
      },
      {
        name: 'buydate',
        id: 'boerse-equityreturn-buydate',
        linetop: true,
        label: 'Kaufdatum',
        addon: 'Datum',
        value: '08.01.2013',
        tooltip: 'Gebe hier das Datum des Tages ein, an welchem die Aktien gekauft worden sind. Sofern ein freier Wert in das Feld eingeben wird, sollte der Datumswert im Format JJJJ-MM-TT sein.',
        type: 'date',
        vtype: 'date'
      },
      {
        name: 'selldate',
        id: 'boerse-equityreturn-selldate',
        label: 'Verkaufsdatum',
        addon: 'Datum',
        value: '28.04.2015',
        tooltip: 'Gebe hier das Datum des Tages ein, an welchem die Aktien verkauft worden sind. Sofern ein freier Wert in das Feld eingeben wird, sollte der Datumswert im Format JJJJ-MM-TT sein.',
        type: 'date',
        vtype: 'date'
      },
      {
        name: 'fees',
        id: 'boerse-equityreturn-fees',
        linetop: true,
        label: 'Sind Gebühren angefallen?',
        placeholder: 'Gebühren',
        tooltip: 'Gebe hier ja an, falls bei Kauf oder Verlauf der Aktie Gebühren angefallen sind. Du kannst dann die Gebühren in den entsprechenden Feldern eingeben. Diese Gebühren werden in der Berechnung der Rendite berücksichtigt. Dabei wird angenommen, dass die Gebühren entsprechend am Kauf- bzw. Verkaufsdatum anfielen. Bei Berechnungen für mehr als eine Aktie gebe hier bitte die Gebühr pro Aktie ein.',
        type: 'select',
        vtype: 'bool',
        options: [
          {
            id: 'false',
            description: 'NEIN'
          },
          {
            id: 'true',
            description: 'JA'
          }
        ]
      },
      {
        name: 'feebuy',
        id: 'boerse-equityreturn-feebuy',
        secondary: true,
        hide: true,
        label: 'Kaufgebühren',
        addon: 'EUR',
        placeholder: 'Kaufgebühren',
        value: '',
        tooltip: 'Gebe hier die Gebühren ein, die beim Kauf der Aktien/Aktien entstanden. Bei Berechnungen für mehr als eine Aktie gebe hier bitte die Gebühr pro Aktie ein.',
        type: 'number',
        vtype: 'number',
        args: [0, 1000000000],
        optional: true
      },
      {
        name: 'feesell',
        id: 'boerse-equityreturn-feesell',
        secondary: true,
        hide: true,
        label: 'Verkaufsgebühren',
        addon: 'EUR',
        placeholder: 'Verkaufsgebühren',
        value: '',
        tooltip: 'Gebe hier die Gebühren ein, die beim Verkauf der Aktien/Aktien entstanden. Bei Berechnungen für mehr als eine Aktie gebe hier bitte die Gebühr pro Aktie ein.',
        type: 'number',
        vtype: 'number',
        args: [0, 1000000000],
        optional: true
      },
      {
        name: 'dividends',
        id: 'boerse-equityreturn-dividends',
        linetop: true,
        label: 'Wie viele Dividendenzahlungen fanden statt?',
        placeholer: 'Dividendenzahlungen',
        tooltip: 'Gebe hier die Anzahl der Dividendenzahlungen an, die während der Halteperiode der Aktie/Aktien erfolgten. Falls keine Dividendenzahlungen erfolgten bzw. Dividenden nicht in der Berechnung berücksichtigt werden sollen, so setze den Wert auf 0. Falls Zahlungen erfolgten, kannst du in den folgenden Feldern für jede Zahlung jeweils das Datum sowie den Dividendenbetrag eingeben. Falls ein freier Wert für das Datum in das Feld eingeben wird, sollte der Datumswert im Format JJJJ-MM-TT sein. Bei Berechnungen für mehr als eine Aktie gebe hier bitte die Dividendenzahlung pro Aktie an.',
        type: 'select',
        vtype: 'number',
        args: [0, 20],
        options: [
          {
            id: '0',
            description: '0'
          },
          {
            id: '1',
            description: '1'
          },
          {
            id: '2',
            description: '2'
          },
          {
            id: '3',
            description: '3'
          },
          {
            id: '4',
            description: '4'
          },
          {
            id: '5',
            description: '5'
          },
          {
            id: '6',
            description: '6'
          },
          {
            id: '7',
            description: '7'
          },
          {
            id: '8',
            description: '8'
          },
          {
            id: '9',
            description: '9'
          },
          {
            id: '10',
            description: '10'
          },
          {
            id: '11',
            description: '11'
          },
          {
            id: '12',
            description: '12'
          },
          {
            id: '13',
            description: '13'
          },
          {
            id: '14',
            description: '14'
          },
          {
            id: '15',
            description: '15'
          },
          {
            id: '16',
            description: '16'
          },
          {
            id: '17',
            description: '17'
          },
          {
            id: '18',
            description: '18'
          },
          {
            id: '19',
            description: '19'
          },
          {
            id: '20',
            description: '20'
          }
        ]
      },
      { 
        name: 'dividendDate',
        id: 'boerse-equityreturn-dividendDate',
        type: 'custom',
        vtype: 'date',
        label: 'Dividendendatum',
        optional: false,
        array: true,
        arrayParent: 'dividends'
      },
      { 
        name: 'dividendAmount',
        id: 'boerse-equityreturn-dividendAmount',
        type: 'custom',
        vtype: 'number',
        args: [0, 1000000000],
        label: 'Dividendenbetrag',
        optional: false,
        array: true,
        arrayParent: 'dividends'
      }
    ],
    results_1: [
      {
        name: 'irr',
        description: 'Rendite/IRR',
        unit: '% p. a.',
        digits: 3,
        importance: 'first',
        tooltip: 'Dieses Feld gibt die berechnete Rendite an. Die Rendite entspricht der Effektivverzinsung bzw. dem internen Zinsfuß (internal rate of return) normalisiert auf ein Jahr.'
      },
      {
        name: 'holding',
        description: 'Haltedauer',
        unit: 'Tage',
        digits: 1,
        importance: 'second',
        tooltip: 'Dieses Feld gibt die aus den Eingaben berechnete Haltedauer in Tagen wieder.'
      }
    ]

  });

  equityreturn.save(function (err) {
    if (err) {
      console.log(err);
      console.log('Seed Failed for Calc.Elem.Model.Equityreturn');
      return next(err);
    } else {
      console.log('Calc.Elem.Model.Equityreturn successfully seeded');
    }
  });



  /**
   * SEED PLANNING-RETIRE
   * */
  var retire = new Calc({
    name: 'retire',
    id: 'planning-retire',
    designation: 'Altersvorsorgerechner',
    description: 'Dieser Rechner kalkuliert dein monatliches Einkommen ab Eintritt des Ruhestandes auf Basis deiner Ersparnisse, deiner Lebenserwartung und aktuellen Kapitalmarktparametern. Der Rechner berücksichtigt nur deine private Altersversorge, evenutelle Bezüge aus der gesetzlichen Rentenversicherung sind nicht berücksichtigt und würden dein monatliches Ruhestandseinkommen entsprechend erhöhen.',
    inputs: [
      {
        name: 'age',
        id: 'planning-retire-age',
        label: 'Aktuelles Lebensalter',
        placeholder: 'Alter',
        addon: 'Jahre',
        value: '43',
        tooltip: 'Gebe hier das aktuelle Alter in Jahren ein.',
        type: 'number',
        vtype: 'number',
        args: [0, 150]
      },
      {
        name: 'retireAge',
        id: 'planning-retire-retireAge',
        label: 'Ruhestandsalter',
        placeholder: 'Ruhestandsalter',
        addon: 'Jahre',
        value: '67',
        tooltip: 'Gebe hier das geplante Ruhestandsalter in Jahren ein.',
        type: 'number',
        vtype: 'number',
        args: [0, 150]
      },
      {
        name: 'lifeExpectancy',
        id: 'planning-retire-lifeExpectancy',
        label: 'Lebenserwartung',
        placeholder: 'Lebenserwartung',
        addon: 'Jahre',
        value: '80',
        tooltip: 'Gebe hier die Lebenserwartung in Jahren ein. Um konservative Ergebnisse zu erhalten, ist es sinnvoll, eine eher höhere Lebenserwartung anzugeben. Dies stellt sicher, dass auch am Ende eines sehr langen Lebens hinreichend Kapital zur Verfügung steht.',
        type: 'number',
        vtype: 'number',
        args: [0, 150]
      },
      {
        name: 'savings', 
        id: 'planning-retire-savings',
        label: 'Heutige Ruhestandsersparnisse',
        placeholder: 'Ruhestandsersparnisse',
        addon: 'EUR',
        value: '25000',
        tooltip: 'Gebe hier den Betrag an, welchen du bereits für deinen Ruhestand gespart hast. ',
        type: 'number',
        vtype: 'number',
        args: [0, 1000000000]
      },
      {
        name: 'futureSavings',
        id: 'planning-retire-futureSavings',
        label: 'Zukünftige jährliche Ersparnisse',
        placeholder: 'Zukünftige jährliche Ersparnisse',
        addon: 'EUR',
        value: '4000',
        tooltip: 'Gebe hier den Betrag an, welchen du in Zukunft pro Jahr bis zu Eintritt deines Ruhestandsalters für deine Altersvorsorge sparen wirst.',
        type: 'number',
        vtype: 'number',
        args: [0, 1000000000]
      },
      {
        name: 'rate',
        id: 'planning-retire-rate',
        label: 'Erwartete Rendite/Verzinsung',
        addon: '% p. a.',
        placeholder: 'Erwartete Rendite',
        value: '4.00',
        tooltip: 'Hier kannst du die erwartete Rendite auf deine Ersparnisse angeben. Mit dieser Rendite werden deine Ersparnisse verzinst. Der voreingestellte Wert entspricht etwa der langfristigen Rendite für Festgeldanlagen.',
        type: 'number',
        vtype: 'number',
        args: [0, 1000]
      },
      {
        name: 'inflation',
        id: 'planning-retire-inflation',
        label: 'Inflationsrate',
        addon: '% p. a.',
        placeholder: 'Inflationsrate',
        value: '4.00',
        tooltip: 'Gebe hier die erwartete Inflationsrate an. Der voreingestellte Wert entspricht etwa der langfristigen Inflationsrate.',
        type: 'number',
        vtype: 'number',
        args: [0, 1000]
      }
    ],
    results_1: [
      {
        name: "balance",
        tooltip: "Die gesamten Ersparnisse zum Ruhestandsalter unter Berücksichtigung von Zinsen. Diese Zahl wird berechnet auf Basis der heutigen Ruhestandsersparnisse sowie der zuküntigen jährlichen Ersparnisse. Die Ersparnisse werden mit der erwarteten Rendite verzinst.",
        description: '',
        unit: '',
        digits: 2,
        importance: 'first'
      },
      {
        name: "balanceInfl",
        tooltip: "Die gesamten realen/inflationsangepassten Ersparnisse zum Ruhestandsalter unter Berücksichtigung von Zinsen.",
        description: '',
        unit: '',
        digits: 2,
        importance: 'first'
      },
      {
        name: "annuityMth",
        tooltip: "Das maximale monatliche nominale Einkommen ab dem Ruhestandsalter bis zum Lebenserwartungsalter, welches aus dem Kapitalstock (angespart bis zum Ruhestandsalter) gezahlt werden kann.",
        description: '',
        unit: '',
        digits: 2,
        importance: 'first'
      },
      {
        name: "annuityMthRetire",
        tooltip: "Der heutige reale Wert des monatlichen Einkommens zu Beginn des Ruhestandes. Dies ist die Antwort auf folgende Frage: Wie viel Wert, in heutigen Geldeinheiten, ist das monatliche Einkommen am Eintritt des Ruhestandes.",
        description: '',
        unit: '',
        digits: 2,
        importance: 'first'
      },
      {
        name: "annuityMthLifeend",
        tooltip: "Der heutige reale Wert des monatlichen Einkommens zum Alter der Lebenserwartung. Dies ist die Antwort auf folgende Frage: Wie viel Wert, in heutigen Geldeinheiten, ist das monatliche Einkommen zum Zeitpunkt der Lebenserwartung/am erwarteten Lebensende.",
        description: '',
        unit: '',
        digits: 2,
        importance: 'first'
      }
    ]
  });


  retire.save(function (err) {
    if (err) {
      console.log(err);
      console.log('Seed Failed for Calc.Elem.Model.Retire');
      return next(err);
    } else {
      console.log('Calc.Elem.Model.Retire successfully seeded');
    }
  });



  /**
   * SEED PROPERTY-PROPERTYRETURN
   * */
  var propertyreturn = new Calc({
    name: 'propertyreturn',
    id: 'property-propertyreturn',
    designation: 'Immobilienrenditerechner',
    description: 'Mit dem Immobilienrenditerechner können Rendite und Zahlungsströme einer Investition in Immobilien errechnet und dargestellt werden.',
    inputs: [
      {
        name: 'equity',
        id: 'property-propertyreturn-equity',
        label: 'Investition aus Eigenkapital',
        placeholder: 'Investition',
        addon: 'EUR',
        value: '180000.00',
        tooltip: 'Gebe hier den Betrag der Anfangsinvestition aus Eigenkapital ein. Dieser Betrag setzt sich zusammen aus allen Kosten, die durch den Erwerb der Immobilien entstehen und nicht durch ein Darlehen gezahlt werden. Kostet eine Immobilien zum Beispiel 400.000 € inkl. aller Anschaffungsnebenkosten und du zahlst am Anfang aus deinem Vermögen 50.000 €, dann sind diese 50.000 € die Investition aus Eigenkapital.',
        type: 'number',
        vtype: 'number',
        args: [0, 1000000000]
      },
      {
        name: 'repay',
        id: 'property-propertyreturn-repay',
        label: 'Rückzahlungsrate Darlehen',
        placeholder: 'Rückzahlungsrate',
        addon: 'EUR/Monat',
        value: '600.00',
        tooltip: 'Sofern du ein Darlehen zur Finanzierung der Immobilien eingesetzt hast, gebe hier bitte die monatliche Rückzahlungsrate für das Darlehen ein. Diese Rückzahlungsrate sollte alle monatlichen Zahlungen zur Rückzahlung des Darlehens enthalten und setzt sich meist aus Zins- und Tilgungszahlungen zusammen. Im Falle der Zahlung einer Immobilien zum Preis von 400.000 € mit 50.000 € Eigenkapital und 350.000 € Fremdkapital aus einem Darlehen ist dies die monatliche Rate, welche für die Rückzahlung des Darlehens zu 350.000 € anfällt. Falls du kein Darlehen eingesetzt hast gebe als Darlehensrate null ein.',
        type: 'number',
        vtype: 'number',
        args: [0, 1000000000]
      },
      {
        name: 'termLoan',
        id: 'property-propertyreturn-termLoan',
        label: 'Darlehenslaufzeit',
        placeholder: 'Darlehenslaufzeit',
        addon: 'Jahre',
        value: '10',
        tooltip: 'Gebe hier die Laufzeit des Darlehens in Jahren oder Monaten ein, welches zur Finanzierung der Immobilie aufgenommen wurde. Die Laufzeit ist die Zeit bis zur kompletten Rückzahlung des Darlehens unter der angegebenen Rückzahlungsrate. Falls du kein Darlehen eingesetzt hast gebe hier null ein.',
        type: 'number',
        vtype: 'number',
        args: [0, 150]
      },
      {
        name: 'maintenance',
        id: 'property-propertyreturn-maintenance',
        label: 'Monatliche Instandhaltungskosten',
        placeholder: 'Instandhaltungskosten',
        addon: 'EUR/Monat',
        value: '200.00',
        tooltip: 'Die monatlichen Instandhaltungskosten sind alle laufenden Kosten, welche monatlich über die gesamte Anlagedauer zur Pflege und zum Erhalt der Immobilien anfallen. Dies sind etwa Kosten für Reparaturen der Heizung oder für die Modernisierung von Bädern.',
        type: 'number',
        vtype: 'number',
        args: [0, 1000000000]
      },
      {
        name: 'costDynamic',
        id: 'property-propertyreturn-costDynamic',
        label: 'Kostendynamik',
        placeholder: 'Kostendynamik',
        addon: '% p. a.',
        value: '0.0',
        tooltip: 'Gebe hier die jährliche prozentale Steigerungsrate der Instandhaltungskosten an. Diese wird jeweils am Jahresende den angegebenen Instandhaltungskosten zugeschlagen. Belaufen sich die Instandhaltungskosten im ersten Jahr zum Beispiel auf 300 € und die Kostendynamik ist 10 %, dann werden im zweiten Jahr Instandhaltungskosten von 330 € angesetz. Auch in den folgenden Jahren wachsen die Instandhaltungskosten jeweils um 10 %. Den Prozentsatz für die Kostendynamik kann man nutzen, um etwa erwartete Preissteigerungen für Instandhaltungsdienstleistungen oder höhere Kosten durch eine alternde Immobilie abzubilden. Sollen die Instandhaltungskosten nicht jedes Jahr ansteigen, dann gebe hier eine null ein.',
        type: 'number',
        vtype: 'number',
        args: [0, 1000]
      },
      {
        name: 'revenue',
        id: 'property-propertyreturn-revenue',
        label: 'Monatliche Mieteinnahmen',
        addon: 'EUR/Monat',
        placeholder: 'Mieteinnahmen',
        value: '900.00',
        tooltip: 'Hier kannst du alle laufenden monatlichen Einnahmen aus der Immobilie eingeben. Hauptkomponente dieser Einnahmen sind meist Zuflüsse aus der Vermietung der Immobilie.',
        type: 'number',
        vtype: 'number',
        args: [0, 1000000000]
      },
      {
        name: 'revDynamic',
        id: 'property-propertyreturn-revDynamic',
        label: 'Einnahmedynamik',
        addon: '% p. a.',
        placeholder: 'Einnahmedynamik',
        value: '1.0',
        tooltip: 'Gebe hier die jährliche prozentale Steigerungsrate der monatlichen Einnahmen aus der Immobilie an. Diese wird jeweils am Jahresende den angegebenen Einnahmen zugeschlagen. Belaufen sich die Einnahmen im ersten Jahr zum Beispiel auf 2000 € und die Kostendynamik ist 1 %, dann werden im zweiten Jahr Einnahmen von 2020 € angesetz. Auch in den folgenden Jahren wachsen die Einnahmen jeweils um 1 %. Sollen die Einnahmen nicht jedes Jahr ansteigen, dann gebe hier eine null ein.',
        type: 'number',
        vtype: 'number',
        args: [0, 1000]
      },
      {
        name: 'term',
        id: 'property-propertyreturn-term',
        label: 'Anlagedauer',
        addon: 'Jahre',
        placeholder: 'Anlagedauer',
        value: '30',
        tooltip: 'Gebe hier die Gesamtlaufzeit der Immobilieninvestition in Jahren oder Monaten an. Diese Laufzeit beginnt mit der Anfangsinvestition und endet in der Regel mit dem Verkauf oder der weitern Verwertung der Immobilie zum definierten Verkaufs-/Endwert.',
        type: 'number',
        vtype: 'number',
        args: [0, 1000]
      },
      {
        name: 'terminal',
        id: 'property-propertyreturn-terminal',
        label: 'Verkaufs-/Endwert',
        addon: 'EUR',
        placeholder: 'Verkaufs-/Endwert',
        value: '240000.00',
        tooltip: 'Gebe hier den Wert der Immobilie zum Ende der Anlagedauer ein. Im Falle eines Verkaufs entspricht dieser Wert dem Verkaufspreis der Immobilie. Ansonsten ist der Endwert derjenige Preis, welcher am Ende der Anlagedauer beim Verkauf der Immobilie erzielt werden würde.',
        type: 'number',
        vtype: 'number',
        args: [0, 1000000000]
      }
    ],
    results_1: [
      {
        name: 'irr',
        description: 'Rendite (Effektivzins, IRR)',
        unit: '% p. a.',
        digits: 3,
        importance: 'first',
        tooltip: 'TBD'
      },
      {
        name: 'profit',
        description: 'Gewinn',
        unit: 'EUR',
        digits: 2,
        importance: 'first',
        tooltip: 'TBD'
      },
      {
        name: 'revenue',
        description: 'Gesamte Einnahmen',
        unit: 'EUR',
        digits: 2,
        importance: 'first',
        tooltip: 'TBD'
      },
      {
        name: 'rentRevenue',
        description: 'Mieteinnahmen',
        unit: 'EUR',
        digits: 2,
        importance: 'second',
        tooltip: 'TBD'
      },
      { 
        name: 'sellRevenue', 
        description: 'Verkaufs-/Endwert',
        unit: 'EUR',
        digits: 2,
        importance: 'second',
        tooltip: 'TBD'
      },
      { 
        name: 'investment', 
        description: 'Gesamte Ausgaben',
        unit: 'EUR',
        digits: 2,
        importance: 'first',
        tooltip: 'TBD'
      },
      { 
        name: 'initialInvestment', 
        description: 'Anfangsinvestition',
        unit: 'EUR',
        digits: 2,
        importance: 'second',
        tooltip: 'TBD'
      },
      {
        name: 'maintenance',
        description: 'Instandhaltungskosten',
        unit: 'EUR',
        digits: 2,
        importance: 'second',
        tooltip: 'TBD'
      },
      {
        name: 'loan',
        description: 'Darlehenszahlungen',
        unit: 'EUR',
        digits: 2,
        importance: 'second',
        tooltip: 'TBD'
      }
    ]
  });




  propertyreturn.save(function (err) {
    if (err) {
      console.log(err);
      console.log('Seed Failed for Calc.Elem.Model.Propertyreturn');
      return next(err);
    } else {
      console.log('Calc.Elem.Model.Propertyreturn successfully seeded');
    }
  });



  /**
   * SEED PROPERTY-PROPERTYBUYRENT
   * */
  var propertybuyrent = new Calc({
    name: 'propertybuyrent',
    id: 'property-buyrent',
    designation: 'Vergleichsrechner Immobilien kaufen oder mieten',
    description: 'Lohnt sich der Kauf einer Immobilie als Eigenheim oder ist es besser, zur Miete zu wohnen und sein Geld anzulegen? Dieser Rechner hilft bei der Entscheidung',
    inputs: [
      {
        name: 'price',
        id: 'property-buyrent-price',
        label: 'Kaufpreis der Immobilie',
        placeholder: 'Kaufpreis',
        addon: 'EUR',
        value: '200000.00',
        tooltip: 'Geben Sie hier den (voraussichtlichen) Kaufpreis der Immobilie ohne Kaufnebenkosten an',
        type: 'number',
        vtype: 'number',
        args: [0, 1000000000]
      },
      {
        name: 'priceaddon',
        id: 'property-buyrent-priceaddon',
        label: 'Kaufnebenkosten',
        placeholder: 'Kaufnebenkosten',
        addon: 'EUR',
        value: '15000.00',
        tooltip: 'Geben Sie hier die Nebenkosten an, welche beim Immobilienkauf entstehen würden. Diese enthalten meist Grunderwerbssteuer sowie Notar- und Grundbuchgebühren.',
        type: 'number',
        vtype: 'number',
        args: [0,10000000]
      },
      {
        name: 'maintenance',
        id: 'property-buyrent-maintenance',
        label: 'Laufende Kosten und Instandhaltungskosten',
        placeholder: 'Laufende Kosten und Instandhaltungskosten',
        addon: 'EUR/Monat',
        value: '200',
        tooltip: 'Geben Sie hier die monatlichen laufenden Kosten (Wasserversorgung, Müllentsorgung, Heizung, etc.) sowie die Instandhaltungskosten der Immobilie an.',
        type: 'number',
        vtype: 'number',
        args: [0, 100000]
      },
      {
        name: 'rent',
        id: 'property-buyrent-rent',
        label: 'Vergleichsmiete inkl. Nebenkosten',
        linetop: true,
        placeholder: 'Vergleichsmiete',
        addon: 'EUR/Monat',
        value: '700',
        tooltip: 'Geben Sie die monatliche Warmmiete an, die bei der Anmietung anfallen würde',
        type: 'number',
        vtype: 'number',
        args: [0, 100000]
      },
      { 
        name: 'equity', 
        id: 'property-buyrent-equity',
        label: 'Eigenkapital',
        linetop: true,
        placeholder: 'Eigenkapital',
        addon: 'EUR',
        value: '50000',
        tooltip: 'Geben Sie das zum Immobilienerwerb verfügbare Eigenkapital an. Der nicht durch Eigenkapital gedeckte Anteil des Kaufpreises wird entsprechend durch ein Darlehen finanziert. Falls keine Immobilie gekauft wird kann dieser Betrag angelegt werden.',
        type: 'number',
        vtype: 'number',
        args: [0, 1000000000]
      },
      {
        name: 'income',
        id: 'property-buyrent-income',
        label: 'Verfügbares Einkommen zum Wohnen',
        linetop: false,
        placeholder: 'Einkommen zum Wohnen',
        addon: 'EUR/Monat',
        value: '1500',
        tooltip: 'Geben Sie hier den monatlichen Betrag an, welchen Sie für Wohnzwecke (Kauf und Unterhaltung einer Immobilie bzw. Anmietung) ausgeben möchten',
        type: 'number',
        vtype: 'number',
        args: [0, 10000000]
      },
      { 
        name: 'equityinterest',  
        id: 'property-buyrent-equityinterest',
        label: 'Zinssatz Geldanlage',
        linetop: false,
        placeholder: 'Zinssatz Geldanlage',
        addon: '% p. a.',
        value: '1.50',
        tooltip: 'Geben Sie hier den Zinssatz an, zu welchem Kapital angelegt werden kann. Beträge, welche nach Zahlung von Miet- bzw. Finanzierungs- und Entstandhaltungskosten übrig bleiben, werden mit diesem Zinssatz verzinst.',
        type: 'number',
        vtype: 'number',
        args: [0,200]
      },
      { 
        name: 'debtinterest', 
        id: 'property-buyrent-debtinterest',
        label: 'Zinssatz Darlehen',
        linetop: false,
        placeholder: 'Zinssatz Darlehen',
        addon: '% p. a.',
        value: '3.00',
        tooltip: 'Geben Sie hier den jährlichen Kreditzinssatz des Darlehens an',
        type: 'number',
        vtype: 'number',
        args: [0, 200]
      },
      {
        name: 'debtpay',
        id: 'property-buyrent-debtpay',
        label: 'Rückzahlungsrate Darlehen',
        linetop: false,
        placeholder: 'Rückzahlungsrate Darlehen',
        addon: 'EUR/Monat',
        value: '1000',
        tooltip: 'Geben Sie hier die Höhe der monatliche Zahlungen an, die der Rückzahlung des Darlehens dienen. Diese konstante Rate deckt die Zins- und Tilgungsleistungen ab.',
        type: 'number',
        vtype: 'number',
        args: [0, 1000000000]
      },
      {
        name: 'period',
        id: 'property-buyrent-period',
        label: 'Analysezeitraum',
        linetop: true,
        placeholder: 'Analysezeitraum',
        addon: 'Jahre',
        value: '20',
        tooltip: 'Hier können Sie den Referenzzeitraum für die Vergleichsrechnung angeben.',
        type: 'number',
        vtype: 'number',
        args: [0,60]
      },
      { 
        name: 'dynamics', 
        id: 'property-buyrent-dynamics',
        linetop: true,
        label: 'Jährliche Steigerungen berücksichtigen?',
        tooltip: 'Wählen Sie hier JA, um jährliche Steigerungen von Miete, Immobilienwert, Kosten und Einkommen in der Rechnung zu berücksichtigen.',
        type: 'select',
        vtype: 'bool',
        options: [
          {
            id: 'false',
            description: 'NEIN'
          },
          {
            id: 'true',
            description: 'JA'
          }
        ]
      },
      { 
        name: 'incomedynamic', 
        id: 'property-buyrent-incomedynamic',
        secondary: true,
        hide: true,
        label: 'Einkommenssteigerung',
        addon: '% p. a.',
        placeholder: 'Einkommenssteigerung',
        value: '0.00',
        tooltip: 'Hier können Sie die jährliche Steigerung des zum Wohnen verfügbaren Einkommens angeben.',
        type: 'number',
        vtype: 'number',
        args: [-200, 200],
        optional: true
      },
      {
        name: 'rentdynamic',
        id: 'property-buyrent-rentdynamic',
        secondary: true,
        hide: true,
        label: 'Mietkostensteigerung',
        addon: '% p. a.',
        placeholder: 'Mietkostensteigerung',
        value: '0.00',
        tooltip: 'Hier können Sie die jährliche Steigerung der Mietkosten angeben.',
        type: 'number',
        vtype: 'number',
        args: [-200, 200],
        optional: true
      },
      {
        name: 'valuedynamic',
        id: 'property-buyrent-valuedynamic',
        secondary: true,
        hide: true,
        label: 'Wertsteigerung Immobilie',
        addon: '% p. a.',
        placeholder: 'Wertsteigerung Immobilie',
        value: '0.00',
        tooltip: 'Hier können Sie die jährliche Steigerung des Immobilienwertes angeben.',
        type: 'number',
        vtype: 'number',
        args: [-200, 200],
        optional: true
      },
      {
        name: 'costdynamic',
        id: 'property-buyrent-costdynamic',
        secondary: 'true',
        hide: 'true',
        label: 'Steigerung der laufenden Kosten/Instandhaltungskosten',
        addon: '% p. a.',
        placeholder: 'Steigerung der laufenden Kosten/Instandhaltungskosten',
        value: '0.00',
        tooltip: 'Hier können Sie die jährliche Steigerung der laufenden Kosten bzw. der Instandhaltungskosten angeben.',
        type: 'number',
        vtype: 'number',
        args: [ -200,200],
        optional: true
      }
    ],
    results_1: [
      { 
        name: 'rentfinalwealth', 
        description: 'Vermögen Mieten',
        unit: 'EUR',
        digits: 2,
        importance: 'first',
        tooltip: 'TBD'
      },
      {
        name: 'rentfinalincome',
        description: 'davon verfügbares Wohneinkommen',
        unit: 'EUR',
        digits: 2,
        importance: 'second',
        tooltip: 'TBD'
      },
      {
        name: 'rentfinalcost',
        description: 'davon Mietkosten',
        unit: 'EUR',
        digits: 2,
        importance: 'second',
        tooltip: 'TBD'
      },
      {
        name: 'rentfinalinterest',
        description: 'davon Zinsertrag',
        unit: 'EUR',
        digits: 2,
        importance: 'second',
        tooltip: 'TBD'
      },
      {
        name: 'rentequity',
        description: 'davon Eigenkapital',
        unit: 'EUR',
        digits: 2,
        importance: 'second',
        tooltip: 'TBD'
      },
      {
        name: 'buyfinalwealth',
        description: 'Vermögen Kaufen',
        unit: 'EUR',
        digits: 2,
        importance: 'first',
        tooltip: 'TBD'
      },
      {
        name: 'buyequity',
        description: 'davon Eigenkapital',
        unit: 'EUR',
        digits: 2,
        importance: 'second',
        tooltip: 'TBD'
      },
      {
        name: 'buyprice',
        description: 'davon Kaufpreis incl. Nebenkosten',
        unit: 'EUR',
        digits: 2,
        importance: 'second',
        tooltip: 'TBD'
      },
      {
        name: 'buyloan',
        description: 'davon Darlehen',
        unit: 'EUR',
        digits: 2,
        importance: 'second',
        tooltip: 'TBD'
      },
      {
        name: 'buyfinalincome',
        description: 'davon verfügbares Wohneinkommen',
        unit: 'EUR',
        digits: 2,
        importance: 'second',
        tooltip: 'TBD'
      },
      {
        name: 'buyinterestsave',
        description: 'davon Zinsertrag',
        unit: 'EUR',
        digits: 2,
        importance: 'second',
        tooltip: 'TBD'
      },
      {
        name: 'buyinterestloan',
        description: 'davon Zinsaufwand',
        unit: 'EUR',
        digits: 2,
        importance: 'second',
        tooltip: 'TBD'
      },
      {
        name: 'buypropertyincrease',
        description: 'davon Wertanstieg Immobilie',
        unit: 'EUR',
        digits: 2,
        importance: 'second',
        tooltip: 'TBD'
      },
      {
        name: 'buymaintenance',
        description: 'davon laufende Kosten und Instandhaltung',
        unit: 'EUR',
        digits: 2,
        importance: 'second',
        tooltip: 'TBD'
      },
      {
        name: 'buyrepay',
        description: 'davon Darlehenstilgung',
        unit: 'EUR',
        digits: 2,
        importance: 'second',
        tooltip: 'TBD'
      },
      {
        name: 'buyresidual',
        description: 'davon Restschuld Darlehen',
        unit: 'EUR',
        digits: 2,
        importance: 'second',
        tooltip: 'TBD'
      },
      {
        name: 'buypropvalue',
        description: 'davon Immobilienwert',
        unit: 'EUR',
        digits: 2,
        importance: 'second',
        tooltip: 'TBD'
      }
    ]
  });


  propertybuyrent.save(function (err) {
    if (err) {
      console.log(err);
      console.log('Seed Failed for Calc.Elem.Model.Propertybuyrent');
      return next(err);
    } else {
      console.log('Calc.Elem.Model.Propertybuyrent successfully seeded');
    }
  });



  /**
   * SEED DEPOSITS-INTEREST
   * */
  var depinterest = new Calc({
    name: 'depinterest',
    id: 'deposits-interest',
    designation: 'Zinsrechner',
    description: 'Mit dem Zinsrechner kann wahlweise der Zinssatz, das Anfangskapital, das Endkapital oder die Laufzeit einer einmaligen Festgeldanlage oder Investition berechnet werden.',
    inputs: [
      { 
        name: 'select',
        id: 'deposits-interest-select',
        label: 'Was soll berechnet werden?',
        tooltip: 'Wähle hier, welche der Größen Anfangskapital, Endkapital, Zinssatz oder Laufzeit berechnet werden soll. Der Rechner wird das Eingabefeld für die zu berechnende Größe dann ausblenden und genau diese Größe berechnen.',
        type: 'select',
        vtype: 'number',
        args: [0, 3],
        options: [
          {
            id: '0',
            description: 'Endkapital'
          },
          {
            id: '1',
            description: 'Anfangskapital'
          },
          {
            id: '2',
            description: 'Zinssatz'
          },
          {
            id: '3',
            description: 'Laufzeit'
          }
        ]
      },
      {
        name: 'start',
        id: 'deposits-interest-start',
        label: 'Anfangskapital',
        addon: 'EUR',
        placeholder: 'Anfangskapital',
        value: '15000.00',
        tooltip: 'Das Anfangskapital ist der anfängliche Anlagebetrag bzw. der Betrag der Investition. Wenn man also 1.000 € bei der Bank zur Anlage bringt, so entspricht dies dem Anfangskapital.',
        type: 'number',
        vtype: 'number',
        args: [0, 1000000000]
      },
      {
        name: 'period',
        id: 'deposits-interest-period',
        label: 'Laufzeit',
        addon: 'Jahre',
        placeholder: 'Laufzeit',
        value: '6',
        tooltip: 'Die Laufzeit ist der Zeitraum zwischen Beginn und Ende der Geldanlage oder Investition. Wenn man also 1.000 € vom 01.03.2015 bis zum 01.03.2017 anlegt, dann beträgt die Laufzeit 2 Jahre.',
        type: 'number',
        vtype: 'number',
        args: [0, 200]
      },
      {
        name: 'rate',
        id: 'deposits-interest-rate',
        label: 'Zinssatz',
        addon: '% p. a.',
        placeholder: 'Zinssatz',
        value: '3.00',
        tooltip: 'Der Zinssatz ist der nominale jährliche Satz, mit dem das angelegte Kapital verzinst wird. Bei einem Zinssatz von 4 % p.a. werden aus 100 € nach einem Jahr 104 €, da man genau 4 € (4 % auf 100 €) pro Jahr erhält.',
        type: 'number',
        vtype: 'number',
        args: [0, 1000]
      },
      {
        name: 'end',
        id: 'deposits-interest-end',
        label: 'Endkapital',
        addon: 'EUR',
        placeholder: 'Endkapital',
        value: '',
        disabled: true,
        tooltip: 'Das Endkapital ist das gesamte Kapital am Ende der Laufzeit der Geldanlage.',
        type: 'number',
        vtype: 'number',
        args: [0,1000000000]
      }
    ],
    results_1: [
      {
        name: 'start',
        tooltip: 'Das Anfangskapital ist der anfängliche Anlagebetrag bzw. der Betrag der Investition. Wenn man also 1.000 € bei der Bank zur Anlage bringt, so entspricht dies dem Anfangskapital.',
        description: 'Anfangskapital',
        unit: 'EUR',
        digits: 2
      },
      {
        name: 'end',
        tooltip: 'Das Endkapital ist das gesamte Kapital am Ende der Laufzeit der Geldanlage.',
        description: 'Endkapital',
        unit: 'EUR',
        digits: 2
      },
      {
        name: 'rate',
        tooltip: 'Der Zinssatz ist der nominale jährliche Satz, mit dem das angelegte Kapital verzinst wird. Bei einem Zinssatz von 4 % p.a. werden aus 100 € nach einem Jahr 104 €, da man genau 4 € (4 % auf 100 €) pro Jahr erhält.',
        description: 'Zinssatz',
        unit: '% p. a.',
        digits: 3
      },
      {
        name: 'period',
        tooltip: 'Die Laufzeit ist der Zeitraum zwischen Beginn und Ende der Geldanlage oder Investition. Wenn man also 1.000 € vom 01.03.2015 bis zum 01.03.2017 anlegt, dann beträgt die Laufzeit 2 Jahre.',
        description: 'Laufzeit',
        unit: 'Jahre',
        digits: 2
      },
      {
        name: 'gain',
        tooltip: 'Der akkumulierte Zinsgewinn entspricht dem gesamten Zinsgewinn über die Laufzeit der Anlage/Investition. Mathematisch entspricht der akkumulierte Zinsgewinn dem Endkapital minus dem Anfangskapital.',
        description: 'Zinsgewinn (akkumuliert)',
        unit: 'EUR',
        digits: 2
      }
    ]
    
  });


  depinterest.save(function (err) {
    if (err) {
      console.log(err);
      console.log('Seed Failed for Calc.Elem.Model.Depinterest');
      return next(err);
    } else {
      console.log('Calc.Elem.Model.Depinterest successfully seeded');
    }
  });


  /**
   * SEED DEPOSITS-SAVINGS
   * */
  var depsaving = new Calc({
    name: 'depsaving',
    id: 'deposits-savings',
    designation: 'Sparrechner',
    description: 'Mit dem Sparrechner kannst du je nach Auswahl verschiedene Parameter wie etwa des Endkapital für einen Sparplan berechnen.',
    inputs: [
      {
        name: 'select',
        id: 'deposits-savings-select',
        label: 'Was soll berechnet werden?',
        tooltip: 'TBD',
        type: 'select',
        vtype: 'number',
        args: [0, 5],
        options: [
          {
            id: '0',
            description: 'Endkapital',
          },
          {
            id: '1',
            description: 'Anfangskapital',
          },
          {
            id: '2',
            description: 'Sparrate',
          },    {
            id: '3',
            description: 'Ansparzeit',
          },
          {
            id: '4',
            description: 'Zinssatz',
          }
        ]
      },
      {
        name: 'principal',
        id: 'deposits-savings-principal',
        label: 'Anfangskapital',
        addon: 'EUR',
        placeholder: 'Anfangskapital',
        value: '10000.00',
        tooltip: 'TBD',
        type: 'number',
        vtype: 'number',
        args: [0,1000000000]
      },
      {
        name: 'term',
        id: 'deposits-savings-term',
        label: 'Ansparzeitraum',
        addon: 'Jahre',
        placeholder: 'Ansparzeitraum',
        value: '6',
        tooltip: 'TBD',
        type: 'number',
        vtype: 'number',
        args: [0, 200]
      },
      {
        name: 'termfix',
        id: 'deposits-savings-termfix',
        label: 'Anlagezeitraum',
        addon: 'Jahre',
        placeholder: 'Anlagezeitraum',
        value: '4',
        tooltip: 'TBD',
        type: 'number',
        vtype: 'number',
        args: [0,200]
      },
      {
        name: 'inflow',
        id: 'deposits-savings-inflow',
        label: 'Sparrate',
        addon: 'EUR',
        placeholder: 'Sparrate',
        value: '100',
        tooltip: 'TBD',
        type: 'number',
        vtype: 'number',
        args: [0,1000000000]
      },
      {
        name: 'inflowfreq',
        id: 'deposits-savings-inflowfreq',
        label: 'Sparintervall',
        tooltip: 'TBD',
        type: 'select',
        vtype: 'number',
        args: [1, 12],
        options: [
          {
            id: '12',
            description: 'monatlich'
          },
          {
            id: '4',
            description: 'vierteljährlich'
          },
          {
            id: '2',
            description: 'halbjährlich'
          },
          {
            id: '1',
            description: 'jährlich'
          }
        ]
      },
      {
        name: 'inflowtype',
        id: 'deposits-savings-inflowtype',
        label: 'Einzahlungsart',
        tooltip: 'TBD',
        type: 'select',
        vtype: 'number',
        args: [1, 2],
        options: [
          {
            id: '1',
            description: 'nachschüssig'
          },
          {
            id: '2',
            description: 'vorschüssig'
          }
        ]
      },
      {
        name: 'interest',
        id: 'deposits-savings-interest',
        label: 'Zinssatz',
        addon: '% p. a.',
        placeholder: 'Zinssatz',
        value: '3.50',
        tooltip: 'TBD',
        type: 'number',
        vtype: 'number',
        args: [0, 1000]
      },
      {
        name: 'dynamic',
        id: 'deposits-savings-dynamic',
        label: 'Dynamisierung',
        addon: '% p. a.',
        placeholder: 'Dynamisierung',
        value: '1.20',
        tooltip: 'TBD',
        type: 'number',
        vtype: 'number',
        args: [0, 1000]
      },
      { 
        name: 'interestperiod', 
        id: 'deposits-savings-interestperiod',
        label: 'Zinsperiode',
        tooltip: 'TBD',
        type: 'select',
        vtype: 'number',
        args: [1, 12],
        options: [
          {
            id: '1',
            description: 'jährlich'
          },
          {
            id: '2',
            description: 'halbjährlich'
          },
          {
            id: '4',
            description: 'vierteljährlich'
          },   
          {
            id: '12',
            description: 'monatlich'
          }
        ]
      },
      { 
        name: 'compounding', 
        id: 'deposits-savings-compounding',
        label: 'Zinseszins',
        tooltip: 'TBD',
        type: 'select',
        vtype: 'number',
        args: [1, 12],
        options: [
          {
            id: '1',
            description: 'Ja, Zinsansammlung'
          },
          {
            id: '2',
            description: 'Nein, Zinsauszahlung'
          }
        ]
      },
      { 
        name: 'terminal', 
        id: 'deposits-savings-terminal',
        label: 'Endkapital',
        addon: 'EUR',
        placeholder: 'Endkapital',
        value: '',
        disabled: true,
        tooltip: 'TBD',
        type: 'number',
        vtype: 'number',
        args: [0,1000000000]
      }
    ],
    results_1: [
      {
        name: 'terminal',
        tooltip: 'TBD',
        description: 'Endkapital',
        unit: 'EUR',
        digits: 2,
        importance: 'first'
      },
      {
        name: 'principal',
        tooltip: 'TBD',
        description: 'Anfangskapital',
        unit: 'EUR',
        digits: 2,
        importance: 'first'
      },
      {
        name: 'inflow',
        tooltip: 'TBD',
        description: 'Sparrate',
        unit: 'EUR',
        digits: 2,
        importance: 'first'
      },
      {
        name: 'term',
        tooltip: 'TBD',
        description: 'Ansparzeitraum',
        unit: 'Jahre',
        digits: 2,
        importance: 'first'
      },
      {
        name: 'interest',
        tooltip: 'TBD',
        description: 'Zinssatz',
        unit: '% p. a.',
        digits: 2,
        importance: 'first'
      }
    ]
  });


  depsaving.save(function (err) {
    if (err) {
      console.log(err);
      console.log('Seed Failed for Calc.Elem.Model.Depsaving');
      return next(err);
    } else {
      console.log('Calc.Elem.Model.Depsaving successfully seeded');
    }
  });


  /**
   * SEED DEBT-ANNUITY
   * */
  var annuity = new Calc({
    name: 'annuity',
    id: 'debt-annuity',
    designation: 'Tilgungsrechner Annuitätendarlehen',
    description: 'Mit dem Tilgungsrechner für Annuitätendarlehen kannst du je nach Auswahl die Rate (Annuität), Restschuld, Laufzeit oder den Zinssatz für Annuitätendarlehen berechnen und einen Tilgungsplan erstellen. Annuitätendarlehen sind Darlehen, welche in konstanten Raten zurückgezahlt werden.',
    inputs: [
      {
        name: 'select',
        id: 'debt-annuity-select',
        label: 'Was soll berechnet werden?',
        tooltip: 'TBD',
        type: 'select',
        vtype: 'number',
        args: [0, 5],
        options: [
          {
            id: '0',
            description: 'Rate/Annuität'
          },
          {
            id: '1',
            description: 'Restschuld'
          },
          {
            id: '2',
            description: 'Laufzeit'
          },
          {
            id: '3',
            description: 'Zinssatz'
          },
          {
            id: '4',
            description: 'Kreditsumme'
          }
        ]
      },
      {
        name: 'principal',
        id: 'debt-annuity-principal',
        label: 'Kreditsumme',
        addon: 'EUR',
        placeholder: 'Kreditsumme',
        value: '15000.00',
        tooltip: 'Geben Sie die Kredit- bzw. Darlehenssumme ein. Dies ist der Betrag, welcher bei Auszahlung des Kredites zur Verfügung gestellt wird.',
        type: 'number',
        vtype: 'number',
        args: [0, 1000000000]
      },
      {
        name: 'term',
        id: 'debt-annuity-term',
        label: 'Laufzeit Ratenzahlungen',
        addon: 'Jahre',
        placeholder: 'Laufzeit Ratenzahlungen',
        value: '3',
        tooltip: 'TBD',
        type: 'number',
        vtype: 'number',
        args: [0,200]
      },
      {
        name: 'repay',
        id: 'debt-annuity-repay',
        label: 'Rate/Annuität',
        addon: 'EUR',
        placeholder: 'Rate/Annuität',
        value: '',
        disabled: true,
        tooltip: 'TBD',
        type: 'number',
        vtype: 'number',
        args: [0, 1000000000]
      },
      {
        name: 'repayfreq',
        id: 'debt-annuity-repayfreq',
        label: 'Zahlungsintervall für Rate',
        tooltip: 'TBD',
        type: 'select',
        vtype: 'number',
        args: [1, 12],
        options: [
          {
            id: '12',
            description: 'monatlich'
          },
          {
            id: '4',
            description: 'vierteljährlich'
          },
          {
            id: '2',
            description: 'halbjährlich'
          },
          {
            id: '1',
            description: 'jährlich'
          }
        ]
      },
      {
        name: 'rate',
        id: 'debt-annuity-rate',
        label: 'Zinssatz',
        addon: '% p. a.',
        placeholder: 'Zinssatz',
        value: '3.50',
        tooltip: 'TBD',
        type: 'number',
        vtype: 'number',
        args: [0, 1000]
      },
      {
        name: 'residual',
        id: 'debt-annuity-residual',
        label: 'Restschuld',
        addon: 'EUR',
        placeholder: 'Restschuld',
        value: '4000',
        tooltip: 'TBD',
        type: 'number',
        vtype: 'number',
        args: [0, 1000000000]
      },
      {
        name: 'fees',
        id: 'debt-annuity-fees',
        linetop: true,
        label: 'Sind Gebühren angefallen?',
        tooltip: 'TBD',
        type: 'select',
        vtype: 'bool',
        options: [
          {
            id: 'false',
            description: 'nein'
          },
          {
            id: 'true',
            description: 'ja'
          }
        ]
      },
      {
        name: 'feeamount',
        id: 'debt-annuity-feeamount',
        secondary: 'true',
        hide: 'true',
        label: 'Gebühren',
        addon: 'EUR',
        placeholder: 'Gebühren',
        value: '',
        tooltip: 'TBD',
        type: 'number',
        vtype: 'number',
        args: [0, 1000000000],
        optional: true
      },
      {
        name: 'feetype',
        id: 'debt-annuity-feetype',
        linetop: false,
        hide: true,
        secondary: 'true',
        label: 'Wie sollen die Gebühren verrechnet werden?',
        tooltip: 'TBD',
        type: 'select',
        vtype: 'number',
        optional: true,
        args: [2, 3],
        options: [
          {
            id: '2',
            description: 'Verrechnung mit der Ratenzahlung/Annuität'
          },
          {
            id: '3',
            description: 'keine Verrechnung, sondern gesonderte Zahlung'
          }
        ]
      },
      {
        name: 'disagio',
        id: 'debt-annuity-disagio',
        label: 'Gab es ein Disagio?',
        tooltip: 'TBD',
        linetop: true,
        type: 'select',
        vtype: 'bool',
        options: [
          {
            id: 'false',
            description: 'nein'
          },
          {
            id: 'true',
            description: 'ja'
          }
        ]
      },
      {
        name: 'disagioamount',
        id: 'debt-annuity-disagioamount',
        secondary: 'true',
        hide: 'true',
        label: 'Disago',
        addon: '%',
        placeholder: 'Disago',
        value: '',
        tooltip: 'TBD',
        type: 'number',
        vtype: 'number',
        args: [0, 100],
        optional: true
      },
      { 
        name: 'repaymentfree', 
        id: 'debt-annuity-repaymentfree',
        label: 'Gab es eine tilgungsfreie Zeit?',
        tooltip: 'TBD',
        linetop: true,
        type: 'select',
        vtype: 'bool',
        options: [
          {
            id: 'false',
            description: 'nein'
          },
          {
            id: 'true',
            description: 'ja'
          }
        ] 
      },
      { 
        name: 'repaymentfreeterm', 
        id: 'debt-annuity-repaymentfreeterm',
        secondary: 'true',
        hide: 'true',
        label: 'Zeitraum',
        addon: 'Jahre',
        placeholder: 'Zeitraum',
        value: '',
        tooltip: 'TBD',
        type: 'number',
        vtype: 'number',
        'args': [0, 1000],
        'optional': true
      },
      { 
        name: 'repaymentfreetype', 
        id: 'debt-annuity-repaymentfreetype',
        linetop: false,
        hide: true,
        secondary: 'true',
        label: 'Wie sollen die Zinsen für die tilgungsfreie Zeit verrechnet werden?',
        tooltip: 'TBD',
        type: 'select',
        vtype: 'number',
        optional: true,
        args: [2,3],
        options: [
          {
            id: '2',
            desciption: 'Verrechnung mit der Ratenzahlung/Annuität'
          },
          {
            id: '3',
            desciption: 'keine Verrechnung, sondern gesonderte Zahlung'
          }
        ]
      }
    ],
    results_1: [
      {
        name: 'repay',
        tooltip: 'TBD',
        description: 'Rate/Annuität',
        unit: 'EUR',
        digits: 2,
        importance: 'first'
      },
      {
        name: 'residual',
        tooltip: 'TBD',
        description: 'Restschuld',
        unit: 'EUR',
        digits: 2,
        importance: 'second'
      },
      {
        name: 'term',
        tooltip: 'TBD',
        description: 'Laufzeit der Ratenzahlungen',
        unit: 'Jahre',
        digits: 2,
        importance: 'second'
      },
      {
        name: 'rate',
        tooltip: 'TBD',
        description: 'Zinssatz',
        unit: '% p. a.',
        digits: 2,
        importance: 'second'
      },
      {
        name: 'principal',
        tooltip: 'TBD',
        description: 'Kreditsumme',
        unit: 'EUR',
        digits: 2,
        importance: 'second'
      },
      {
        name: 'irr',
        tooltip: 'TBD',
        description: 'Effektiver Jahreszins / IRR',
        unit: '% p. a.',
        digits: 2,
        importance: 'second'
      }
    ] 

  });


  annuity.save(function (err) {
    if (err) {
      console.log(err);
      console.log('Seed Failed for Calc.Elem.Model.Annuity');
      return next(err);
    } else {
      console.log('Calc.Elem.Model.Annuity successfully seeded');
    }
  });


  /**
   * SEED MISC-DAYCOUNT
   * */
  var daycount = new Calc({
    name: 'daycount',
    id: 'misc-daycount',
    designation: 'Zinstagerechner',
    description: 'Mit dem Zinsrechner kann die Anzahl der Zinstage und der Zinsfaktor zwischen zwei Daten nach verschiedenen Zinsmethoden berechnet werden.',
    inputs: [
      {
        name: 'begindate',
        id: 'misc-daycount-begindate',
        linetop: false,
        label: 'Anfangsdatum',
        addon: 'Datum',
        value: '08.01.2013',
        tooltip: 'Geben Sie hier das Anfangsdatum der Zinsperiode ein.',
        type: 'date',
        vtype: 'date'
      },
      {
        name: 'enddate',
        id: 'misc-daycount-enddate',
        linetop: false,
        label: 'Enddatum',
        addon: 'Datum',
        value: '08.05.2015',
        tooltip: 'Geben Sie hier das Enddatum der Zinsperiode ein.',
        type: 'date',
        vtype: 'date'
      }
    ],
    results_1: [
      {
        name: 'actdays',
        tooltip: 'Die Anzahl abgelaufener Kalendertage vom Anfangs- bis zum Endddatum. Bei der Berechnung wird - wie gewöhnlich - das Anfangsdatum als voller Tag mitgezählt, während der Tag des Enddatums nicht gezählt wird. Zum Beispiel wird bei der Berechnung der Kalendertage vom 01.01.2015 bis zum 02.01.2015 der Tag des Enddatums (02.01.2015) nicht gezählt. Die Anzahl abgelaufener Kalendertage ist in diesem Beispiel also 1.',
        description: 'Anzahl der Kalendertage',
        unit: 'Tage',
        digits: 0,
        importance: 'first'
      },
      {
        name: 'act360',
        tooltip: 'Die folgenden Angaben enthalten die Zinstage und den Zinsfaktor berechnet nach der act/360-Konvention, welche auch als französische Zinsmethode bezeichnet wird. Diese Methode wird allgemein häufig für Geldmarktinstrumente angewendet. Man nutzt sie für Bundesanleihen mit variablem Zins, Floating Rate Notes, unverzinslichen Schatzanweisungen und Refinanzierungen sowie Anlagen bei der EZB.',
        description: 'act / 360',
        unit: '',
        digits: 0,
        importance: 'first',
        type: 'string'
      },
      {
        name: 'act360interestdays',
        tooltip: 'TBD',
        omittooltip: true,
        description: 'Zinstage',
        unit: ' Tage',
        digits: 0,
        importance: 'second'
      },
      {
        name: 'act360factor',
        tooltip: 'TBD',
        omittooltip: true,
        description: 'Faktor (Dezimal)',
        unit: '',
        digits: 6,
        importance: 'second'
      },
      {
        name: 'act360factorF',
        tooltip: 'TBD',
        omittooltip: true,
        description: 'Faktor (Bruch)',
        unit: '',
        type: 'string',
        importance: 'second'
      },
      {
        name: 'act365',
        tooltip: 'Die folgenden Angaben enthalten die Zinstage und den Zinsfaktor berechnet nach der act/365-Konvention, welche auch als englische Zinsmethode bezeichnet wird. Sie kommt zum Beispiel bei englischen oder belgischen Geldmarktpapieren zur Anwendung.',
        description: 'act / 365',
        unit: '',
        digits: 0,
        importance: 'first',
        type: 'string'
      },
      {
        name: 'act365interestdays',
        tooltip: 'TBD',
        omittooltip: true,
        description: 'Zinstage',
        unit: ' Tage',
        digits: 0,
        importance: 'second'
      },
      {
        name: 'act365factor',
        tooltip: 'TBD',
        omittooltip: true,
        description: 'Faktor (Dezimal)',
        unit: '',
        digits: 6,
        importance: 'second'
      },
      {
        name: 'act365factorF',
        tooltip: 'TBD',
        omittooltip: true,
        description: 'Faktor (Bruch)',
        unit: '',
        type: 'string',
        importance: 'second'
      },
      {
        name: 'a30E360',
        tooltip: 'Die folgenden Angaben enthalten die Zinstage und den Zinsfaktor berechnet nach der deutschen Zinsrechnung, welche der Rechnungskonvention nach 30E/360 ISDA entspricht. Bei praktisch allen Zinsberechnungen für deutsche Sparkonten, Festgeldkonten, Kontokorrentkonten, Ratenkredite und langfristigen Darlehen kommt diese Berechnungsmethode zur Anwendung.',
        description: '30E / 360 ISDA, Deutsche Zinsmethode',
        unit: '',
        digits: 0,
        importance: 'first',
        type: 'string'
      },
      {
        name: 'a30E360interestdays',
        tooltip: 'TBD',
        omittooltip: true,
        description: 'Zinstage',
        unit: ' Tage',
        digits: 0,
        importance: 'second'
      },
      {
        name: 'a30E360factor',
        tooltip: 'TBD',
        omittooltip: true,
        description: 'Faktor (Dezimal)',
        unit: '',
        digits: 6,
        importance: 'second'
      },
      {
        name: 'a30E360factorF',
        tooltip: 'TBD',
        omittooltip: true,
        description: 'Faktor (Bruch)',
        unit: '',
        type: 'string',
        importance: 'second'
      },
      {
        name: 'a30360',
        tooltip: 'Die folgenden Angaben enthalten die Zinstage und den Zinsfaktor berechnet nach der ISDA-30/360-Bond-Basis-Methode. Diese Methode kommt oft bei gehandelten US-amerikanischen Anleihen zur Anwendung.',
        description: '30 / 360, ISDA Anleihenbasis',
        unit: '',
        digits: 0,
        importance: 'first',
        type: 'string'
      },
      {
        name: 'a30360interestdays',
        tooltip: 'TBD',
        omittooltip: true,
        description: 'Zinstage',
        unit: ' Tage',
        digits: 0,
        importance: 'second'
      },
      {
        name: 'a30360factor',
        tooltip: 'TBD',
        omittooltip: true,
        description: 'Faktor (Dezimal)',
        unit: '',
        digits: 6,
        importance: 'second'
      },
      {
        name: 'a30360factorF',
        tooltip: 'TBD',
        omittooltip: true,
        description: 'Faktor (Bruch)',
        unit: '',
        type: 'string',
        importance: 'second'
      },
      {
        name: 'actact',
        tooltip: 'Die folgenden Angaben enthalten die Zinstage und den Zinsfaktor berechnet nach der act/act Zinsmethode, auch bezeichnet als tagesgenaue oder Effektivzinsmethode. Diese Methode verwendet man zum Beispiel für Bundesanleihen mit festem Zins, Bundesobligationen, Bundesschatzanweisungen, Bundesschatzbriefe sowie für viele börsennotierte Anleihen.',
        description: 'act / act, Taggenau',
        unit: '',
        digits: 0,
        importance: 'first',
        type: 'string'
      },
      {
        name: 'actactinterestdays',
        tooltip: 'TBD',
        omittooltip: true,
        description: 'Zinstage',
        unit: ' Tage',
        digits: 0,
        importance: 'second'
      },
      {
        name: 'actactfactor',
        tooltip: 'TBD',
        omittooltip: true,
        description: 'Faktor (Dezimal)',
        unit: '',
        digits: 6,
        importance: 'second'
      },
      {
        name: 'actactfactorF',
        tooltip: 'TBD',
        omittooltip: true,
        description: 'Faktor (Bruch)',
        unit: '',
        type: 'string',
        importance: 'second'
      }
    ]
  });


  daycount.save(function (err) {
    if (err) {
      console.log(err);
      console.log('Seed Failed for Calc.Elem.Model.Daycount');
      return next(err);
    } else {
      console.log('Calc.Elem.Model.Daycount successfully seeded');
    }
  });


  /**
   * SEED DEBT-DISPO
   * */
  var dispo = new Calc({
    name: 'dispo',
    id: 'debt-dispo',
    designation: 'Dispozinsrechner',
    description: 'Mit dem Dispozinsrechner können die für einen Dispo anfallenden Dispo- und Überziehungszinsen berechnet werden.',
    inputs: [
      {
        name: 'principal',
        id: 'debt-dispo-principal',
        linetop: false,
        label: 'Betrag Kontoüberziehung',
        addon: 'EUR',
        value: '1000.00',
        tooltip: 'Dies ist der Betrag, um den das Konto "im Minus" ist.',
        type: 'number',
        vtype: 'number',
        args: [0, 1000000000]
      },
      {
        name: 'limit',
        id: 'debt-dispo-limit',
        linetop: false,
        label: 'Kreditlinie Dispo',
        addon: 'EUR',
        value: '2000.00',
        tooltip: 'Die Kreditlinie für den Dispo ist der Betrag, bis zu dem der Dispositionskredit in Anspruch genommen werden darf. Auf diesen Betrag kommt der Zinssatz für den Dispokredit zur Anwendung. Falls kein Dispositionskredit besteht tragen sie hier eine 0 ein. Der Überziehungsbetrag wird dann direkt mit dem Zinssatz für weitere Überziehungen verzinst.',
        type: 'number',
        vtype: 'number',
        args: [0, 1000000000]
      },
      {
        name: 'dispointerest',
        id: 'debt-dispo-dispointerest',
        label: 'Zinssatz Dispo',
        addon: '% p. a.',
        placeholder: 'Zinssatz',
        value: '12.50',
        tooltip: 'Geben Sie hier den nominalen Jahreszinssatz ein, welchen die Bank für die Nutzung des Dispositionskredites berechnet.',
        type: 'number',
        vtype: 'number',
        args: [0, 1000]
      },
      {
        name: 'otherinterest',
        id: 'debt-dispo-otherinterest',
        label: 'Zinssatz weitere Überziehung',
        addon: '% p. a.',
        placeholder: 'Zinssatz',
        value: '15.50',
        tooltip: 'Geben Sie hier den nominalen Jahreszinssatz ein, welchen die Bank für Überziehungen berechnet, die über die Kreditlinie des Dispositionskredits hinausgehen ("geduldete Überziehung").',
        type: 'number',
        vtype: 'number',
        args: [0, 1000]
      },
      {
        name: 'periodchoice',
        id: 'debt-dispo-periodchoice',
        linetop: true,
        label: 'Zeitraum eingeben über...',
        tooltip: 'Entscheiden Sie hier, ob der Zeitraum als Datumsbereich (von / bis) oder mittels Zinstagen eingegeben werden soll.',
        type: 'select',
        vtype: 'string',
        options: [
          {
            id: 'dates',
            description: 'Datumsbereich'
          },
          {
            id: 'days',
            description: 'Zinstage'
          }
        ]
      },
      {
        name: 'startdate',
        id: 'debt-dispo-startdate',
        linetop: false,
        optional: true,
        label: 'Anfangsdatum',
        addon: 'Datum',
        value: '14.04.2015',
        tooltip: 'Erster Tag der Berechnungsperiode',
        secondary: true,
        type: 'date',
        vtype: 'date'
      },
      {
        name: 'enddate',
        id: 'debt-dispo-enddate',
        linetop: false,
        optional: true,
        label: 'Enddatum',
        addon: 'Datum',
        value: '10.05.2015',
        tooltip: 'Letzter Tag der Berechnungsperiode',
        secondary: true,
        type: 'date',
        vtype: 'date'
      },
      {
        name: 'days',
        id: 'debt-dispo-days',
        linetop: false,
        label: 'Zinstage',
        addon: 'Tage',
        value: '100',
        optional: true,
        hide: true,
        secondary: true,
        tooltip: 'Die Dauer der Zinsperiode in Tagen nach der gewählten Zinsmethode.',
        type: 'number',
        vtype: 'number',
        args: [0, 10000]
      },
      {
        name: 'daycount',
        id: 'debt-dispo-daycount',
        linetop: true,
        label: 'Zinsmethode',
        tooltip: 'Anzuwendendes Verfahren zur Berechnung der Zins- und Basistage.',
        type: 'select',
        vtype: 'string',
        options: [
          {
            id: 'a30E360',
            description: '30E / 360 ISDA, Deutsche Zinsmethode'
          },
          {
            id: 'a30360',
            description: '30E / 360, ISDA Anleihenbasis'
          },
          {
            id: 'act360',
            description: 'act / 360'
          },
          {
            id: 'act365',
            description: 'act / 365'
          },
          {
            id: 'actact',
            description: 'act / act, Taggenaue Methode'
          }
        ]
      }
    ],
    results_1: [
      {
        name: 'interestamount',
        tooltip: 'Der aufgrund der Überziehung zu zahlende Zinsbetrag.',
        description: 'Überziehungszinsen',
        unit: 'EUR',
        digits: 2,
        importance: 'first'
      },
      {
        name: 'averageinterest',
        tooltip: 'Dieser Wert gibt den auf die Überziehung zutreffenden annualisierten Sollzinssatz wieder. Sofern der Betrag der Kontoüberziehung unter der Kreditlinie bleibt entspricht der Sollzinssatz dem Dispozinssatz. Übersteigt die Kontoüberziehung die Kreditlinie, so berechnet sich der Sollzinssatz als entsprechend gewichtetes Mittel aus dem Dispozinssatz und dem Zinssatz für weitere Überziehungen.',
        description: 'Gewichteter Sollzinssatz',
        unit: '% p. a.',
        digits: 3,
        importance: 'first'
      }
    ]
  });


  dispo.save(function (err) {
    if (err) {
      console.log(err);
      console.log('Seed Failed for Calc.Elem.Model.Dispo');
      return next(err);
    } else {
      console.log('Calc.Elem.Model.Dispo successfully seeded');
    }
  });




  /**
   * SEED PROPERTY-RENT
   * */
  var rent = new Calc({
    name: 'rent',
    id: 'property-rent',
    designation: 'Mietrechner',
    description: 'Mit dem Mietrechner können Sie analysieren, wie viel Miete Sie über einen bestimmten Zeitraum insgesamt zahlen. Der Rechner wird oft zur Berechnung der über die Lebenszeit anfallenden Miete genutzt. ',
    inputs: [
      {
        name: 'select',
        id: 'property-rent-select',
        label: 'Was soll berechnet werden?',
        tooltip: 'Wähle hier, welche der Größen Monatsmiete, Mietsteigerung, Mietdauer oder Gesamtmiete berechnet werden soll. Der Rechner wird das Eingabefeld für die zu berechnende Größe dann ausblenden und genau diese Größe berechnen.',
        type: 'select',
        vtype: 'number',
        args: [0,3],
        options: [
          {
            id: '0',
            description: 'Gesamtmiete'
          },
          {
            id: '1',
            description: 'Mietsteigerung'
          },
          {
            id: '2',
            description: 'Mietdauer'
          },
          {
            id: '3',
            description: 'Monatsmiete'
          }
        ]
      },
      {
        name: 'rent',
        id: 'property-rent-rent',
        linetop: false,
        optional: false,
        label: 'Monatsmiete',
        placeholder: 'Monatsmiete',
        addon: 'EUR',
        value: '800.00',
        tooltip: 'Geben Sie hier die aktuelle monatliche Gesamtmiete ein.',
        type: 'number',
        vtype: 'number',
        args: [0, 1000000]
      },
      {
        name: 'dynamic',
        id: 'property-rent-dynamic',
        label: 'Jährliche Mietsteigerung',
        addon: '% p. a.',
        optional: false,
        placeholder: 'Mietsteigerung',
        value: '2.00',
        tooltip: 'Geben Sie hier die erwartete jährliche Mietsteigerung über die Mietdauer an. Falls keine Mietsteigerung berücksichtigt werden soll, geben Sie bitte 0 ein.',
        type: 'number',
        vtype: 'number',
        args: [ -30,30]
      },
      {
        name: 'term',
        id: 'property-rent-term',
        linetop: false,
        label: 'Mietdauer',
        placeholder: 'Mietdauer',
        optional: false,
        addon: 'Jahre',
        value: '25',
        tooltip: 'Geben Sie hier die insgesamt zu betrachtende Mietdauer ein.',
        type: 'number',
        vtype: 'number',
        args: [0, 75]
      },
      {
        name: 'renttotal',
        id: 'property-rent-renttotal',
        linetop: false,
        label: 'Gesamte Miete',
        placeholder: 'Gesamte Miete',
        addon: 'EUR',
        disabled: true,
        optional: false,
        value: '',
        tooltip: 'Die Summe aller in der Mietdauer zu zahlenden Monatsmieten.',
        type: 'number',
        vtype: 'number',
        args: [0, 1000000000]
      }
    ],
    results_1: [
      {
        name: 'renttotal',
        tooltip: '',
        omittooltip: true,
        description: 'Gesamte Miete',
        unit: 'EUR',
        digits: 2,
        importance: 'first'
      },
      {
        name: 'rent',
        tooltip: '',
        omittooltip: true,
        description: 'Monatsmiete',
        unit: 'EUR',
        digits: 2,
        importance: 'first'
      },
      {
        name: 'dynamic',
        tooltip: '',
        omittooltip: true,
        description: 'Jährliche Mietsteigerung',
        unit: '% p. a.',
        digits: 2,
        importance: 'first'
      },
      {
        name: 'term',
        tooltip: '',
        omittooltip: true,
        description: 'Mietdauer',
        unit: 'Jahre',
        digits: 2,
        importance: 'first'
      }
    ]
  });
  
  
  
  rent.save(function (err) {
    if (err) {
      console.log(err);
      console.log('Seed Failed for Calc.Elem.Model.Rent');
      return next(err);
    } else {
      console.log('Calc.Elem.Model.Rent successfully seeded');
    }
  });
  
  
  
  /**
   * SEED PROPERTY-TRANSFERTAX
   * */
  var transfertax = new Calc({
    name: 'transfertax',
    id: 'property-transfertax',
    designation: 'Grunderwerbssteuer-Rechner',
    description: 'Mit dem Grunderwerbssteuer-Rechner lässt sich die Steuer berechnen, welche beim Erwerb eines Grundstücks oder Grundstücksanteils anfällt. Ökonomisch erhöht die Grunderwerbssteuer den Gesamtpreis beim Kauf einer Immobilie bzw. eines Grundstücks.',
    inputs: [
      { 
        name: 'price', 
        id: 'property-transfertax-price',
        linetop: false,
        optional: false,
        label: 'Kaufpreis Immobilie/Grundstück',
        placeholder: 'Kaufpreis',
        addon: 'EUR',
        value: '350000.00',
        tooltip: 'Geben Sie hier den Kaufpreis des Grundstücks an. Sofern eine Immobilie auf dem Grundstück steht ist der Kaufpreis zu verstehen als Gesamtpreis aus Grundstück und Immobilien.',
        type: 'number',
        vtype: 'number',
        args: [0,100000000000]
      },
      { 
        name: 'state', 
        id: 'property-transfertax-state',
        label: 'Bundesland',
        placeholder: 'Bundesland',
        tooltip: 'Geben Sie das Bundesland des Standorts der zu erwerbenden Immobilie an.',
        type: 'select',
        vtype: 'string',
        options: [
          {
            id: 'BAD',
            description: 'Baden-Württemberg'
          },
          {
            id: 'BAY',
            description: 'Bayern'
          },
          {
            id: 'BER',
            description: 'Berlin'
          },    {
            id: 'BRA',
            description: 'Brandenburg'
          },    
          {
            id: 'BRE',
            description: 'Bremen'
          },
          {
            id: 'HAM',
            description: 'Hamburg'
          },
          {
            id: 'HES',
            description: 'Hessen'
          },
          {
            id: 'MEC',
            description: 'Mecklenburg-Vorpommern'
          },
          {
            id: 'NIE',
            description: 'Niedersachsen'
          },
          {
            id: 'NOR',
            description: 'Nordrhein-Westfalen'
          },
          {
            id: 'RHE',
            description: 'Rheinland-Pfalz'
          },
          {
            id: 'SAR',
            description: 'Saarland'
          },
          {
            id: 'SAC',
            description: 'Sachsen'
          },
          {
            id: 'SAA',
            description: 'Sachsen-Anhalt'
          },
          {
            id: 'SCH',
            description: 'Schleswig-Holstein'
          },
          {
            id: 'THU',
            description: 'Thüringen'
          }
        ]
      }      
    ],
    results_1: [
      {
        name: 'total',
        tooltip: 'Der Gesamtbetrag bestehend aus dem Kaufpreis und der anfallenden Grunderwerbssteuer.',
        omittooltip: false,
        description: 'Gesamtbetrag inkl. Steuer',
        unit: 'EUR',
        digits: 2,
        importance: 'first'
      },
      {
        name: 'tax',
        tooltip: 'Bei der Transaktion anfallender Betrag der Grunderwerbssteuer.',
        description: 'Grunderwerbssteuer',
        unit: 'EUR',
        digits: 2,
        importance: 'second'
      },
      {
        name: 'rate',
        tooltip: 'Der im gewählten Bundesland aktuell anwendbare Steuersatz.',
        description: 'Anzuwendender Steuersatz',
        unit: '% p. a.',
        digits: 2,
        importance: 'second'
      },
      {
        name: 'taxfree',
        tooltip: 'Es besteht eine Freigrenze von 2500 EUR. Sofern der Kaufpreis darunter liegt, fällt keine Grunderwerbssteuer an.',
        description: 'Freigrenze anwendbar?',
        type: 'string',
        unit: '',
        importance: 'second'
      }
    ]
    
  });
  
  
  transfertax.save(function (err) {
    if (err) {
      console.log(err);
      console.log('Seed Failed for Calc.Elem.Model.Transfertax');
      return next(err);
    } else {
      console.log('Calc.Elem.Model.Transfertax successfully seeded');
    }
  });
  
  
  
  
  /**
   * SEED PROPERTY-HOMESAVE
   * */
  var homesave = new Calc({
    name: 'homesave',
    id: 'property-homesave',
    designation: 'Bausparrechner',
    description: 'Mit dem Bausparrechner können Sie Bausparverträge berechnen und Spar- sowie Tilgungspläne analysieren. Ermitteln Sie, ob sich ein Bausparvertrag für Sie lohnt oder vergleichen Sie die Angebote verschiedener Bausparkassen.',
    inputs: [
      {
        name: 'principal',
        id: 'property-homesave-principal',
        linetop: false,
        optional: false,
        label: 'Bausparsumme',
        placeholder: 'Bausparsumme',
        addon: 'EUR',
        value: '50000.00',
        tooltip: 'Geben Sie hier den Gesamtbetrag ein, über den der Bausparvertrag abgeschlossen wird. Dies ist der Betrag, welcher bei Zuteilung des Bausparvertrages ausgezahlt wird.',
        type: 'number',
        vtype: 'number',
        args: [0,1000000000]
      },
      {
        name: 'interestsave',
        id: 'property-homesave-interestsave',
        linetop: true,
        optional: false,
        label: 'Guthabenzinssatz',
        placeholder: 'Guthabenzinssatz',
        addon: '% p. a.',
        value: '0.50',
        tooltip: 'Geben Sie den jährlichen Zinssatz ein, welchen Sie laut Bausparvertrag auf das angesparte Kapital erhalten.',
        type: 'number',
        vtype: 'number',
        args: [0, 20]
      },
      {
        name: 'saving',
        id: 'property-homesave-saving',
        linetop: false,
        optional: false,
        label: 'Sparbeitrag',
        placeholder: 'Monatlicher Sparbeitrag',
        addon: 'EUR / Monat',
        value: '250.00',
        tooltip: 'Geben Sie den Beitrag ein, welcher in der Ansparphase monatlich in den Bausparvertrag eingezahlt wird. Es wird unterstellt, dass die Zahlung jeweils am Monatsende (nachschüssig) erfolgt.',
        type: 'number',
        vtype: 'number',
        args: [0, 100000]
      },
      {
        name: 'termsave',
        id: 'property-homesave-termsave',
        linetop: false,
        optional: false,
        label: 'Anspardauer',
        placeholder: 'Anspardauer',
        addon: 'Jahre',
        value: '10',
        tooltip: 'Geben Sie die Anspardauer in Jahren ein. Während der Anspardauer erfolgen die monatlichen Sparbeiträge',
        type: 'number',
        vtype: 'number',
        args: [0, 100]
      },
      {
        name: 'initialfee',
        id: 'property-homesave-initialfee',
        linetop: false,
        optional: false,
        label: 'Abschlussgebühr',
        placeholder: 'Abschlussgebühr',
        addon: 'EUR',
        value: '0.00',
        tooltip: 'Geben Sie hier eventuelle einmalige Gebühren ein, welche beim Abschluss des Vertrages anfallen. Dies Gebühren werden mit den Einzahlungen verrechnet. Falls keine einmaligen Gebühren anfallen, tragen Sie einfach 0 ein.',
        type: 'number',
        vtype: 'number',
        args: [0, 100000]
      },
      {
        name: 'initialpay',
        id: 'property-homesave-initialpay',
        linetop: false,
        optional: false,
        label: 'Sondereinzahlung bei Beginn',
        placeholder: 'Sondereinzahlung',
        addon: 'EUR',
        value: '0.00',
        tooltip: 'Hier können Sie einmalige Sparbeiträge eingeben, welche bei manchen Verträgen zu Beginn der Vertragsperiode möglich sind. Diese Sondereinzahlungen werden entsprechend über die Ansparperiode verzinst.',
        type: 'number',
        vtype: 'number',
        args: [0, 100000]
      },
      {
        name: 'bonus',
        id: 'property-homesave-bonus',
        linetop: true,
        label: 'Wohnungsbauprämie berücksichtigen?',
        tooltip: 'Geben Sie an, ob die Wohnungsbauprämie berücksichtigt werden soll. Falls Sie "JA" angeben, wird der Rechner mittels weiterer Fragen zunächst feststellen, ob und in welchem Umfang Anspruch auf die Wohnungsbauprämie besteht. Sofern Anspruch besteht wird die entsprechende Prämie automatisch in die Berechnung einbezogen.',
        type: 'select',
        vtype: 'bool',
        options: [
          {
            id: 'true',
            description: 'JA'
          },
          {
            id: 'false',
            description: 'NEIN'
          }
        ]
      },
      {
        name: 'marriage',
        id: 'property-homesave-marriage',
        linetop: false,
        secondary: true,
        optional: true,
        label: 'Familienstand',
        tooltip: 'Geben Sie den Familienstand zur Berechnung von Förderansprüchen an.',
        type: 'select',
        vtype: 'bool',
        options: [
          {
            id: 'false',
            description: 'ledig'
          },
          {
            id: 'true',
            description: 'verheiratet'
          }
        ]
      },
      {
        name: 'income',
        id: 'property-homesave-income',
        linetop: false,
        optional: true,
        secondary: true,
        label: 'Bruttoeinkommen',
        placeholder: 'Bruttoeinkommen',
        addon: 'EUR',
        value: '30000.00',
        tooltip: 'Geben Sie das Bruttoeinkommen zur Berechnung von Förderansprüchen an. Falls Sie verheiratet sind geben Sie hier bitte die Summe der Einkommen beider Ehepartner an.',
        type: 'number',
        vtype: 'number',
        args: [0, 10000000]
      },
      {
        name: 'interestdebt',
        id: 'property-homesave-interestdebt',
        linetop: true,
        optional: false,
        label: 'Darlehenszinssatz',
        placeholder: 'Darlehenszinssatz',
        addon: '% p. a.',
        value: '2.50',
        tooltip: 'Geben Sie den jährlichen Zinssatz ein, welchen Sie laut Bausparvertrag für das Bauspardarlehen zahlen.',
        type: 'number',
        vtype: 'number',
        args: [0,20]
      },
      {
        name: 'repay',
        id: 'property-homesave-repay',
        linetop: false,
        optional: false,
        label: 'Rückzahlungsrate Darlehen (Zins + Tilgung)',
        placeholder: 'Rückzahlungsrate',
        addon: 'EUR / Monat',
        value: '300',
        tooltip: 'Geben Sie den monatlichen Betrag zur Rückzahlung des Darlehens ein. Dieser Betrag fällt nach Zuteilung während der Rückzahlungsphase an und besteht aus Zins und Tilgung. Es wird unterstellt, dass die Zahlung jeweils am Monatsende (nachschüssig) erfolgt.',
        type: 'number',
        vtype: 'number',
        args: [0,100000]
      },
      {
        name: 'paypercent',
        id: 'property-homesave-paypercent',
        linetop: false,
        optional: false,
        label: 'Auszahlungsprozentsatz der Bausparsumme',
        placeholder: 'Auszahlungsprozentsatz',
        addon: '%',
        value: '100',
        tooltip: 'Bei Standardverträgen ist der Auszahlungsprozentsatz 100% der Bausparsumme. Bei einigen Verträgen kann jedoch davon nach oben oder unten abgewichen werden, was die Auszahlung relativ zur Bausparsumme entsprechend erhöht oder senkt. Im Zweifel sollten Sie hier 100% eingeben.',
        type: 'number',
        vtype: 'number',
        args: [50,300]
      }
    ],
    results_1: [
      {
        name: 'numberpays',
        tooltip: 'TBD',
        description: 'Anzahl Sparraten',
        unit: '',
        digits: 0,
        importance: 'second'
      },
      {
        name: 'finalsavings',
        tooltip: 'TBD',
        description: 'Sparguthaben Ende Ansparphase',
        unit: 'EUR',
        digits: 2,
        importance: 'first'
      },
      {
        name: 'finalsavingswohnungsbau',
        tooltip: 'TBD',
        description: 'Sparguthaben Ende Ansparphase',
        unit: 'EUR',
        digits: 2,
        importance: 'first'
      },
      {
        name: 'totalpays',
        tooltip: 'TBD',
        description: 'davon Spareinzahlungen',
        unit: 'EUR',
        digits: 2,
        importance: 'second'
      },
      {
        name: 'totalinterest',
        tooltip: 'TBD',
        description: 'davon Guthabenzinsen',
        unit: 'EUR',
        digits: 2,
        importance: 'second'
      },
      {
        name: 'wohnungsbau',
        tooltip: 'TBD',
        description: 'davon Wohnungsbauprämie',
        unit: 'EUR',
        digits: 2,
        importance: 'second'
      },
      {
        name: 'totalloanpay',
        tooltip: 'TBD',
        description: 'Auszahlungsbetrag bei Zuteilung',
        unit: 'EUR',
        digits: 2,
        importance: 'first'
      },
      {
        name: 'totalloan',
        tooltip: 'TBD',
        description: 'davon Darlehenshöhe',
        unit: 'EUR',
        digits: 2,
        importance: 'second'
      },
      {
        name: 'termloan',
        tooltip: 'TBD',
        description: 'Laufzeit des Darlehens',
        unit: 'Jahre',
        digits: 2,
        importance: 'second'
      },
      {
        name: 'interestloan',
        tooltip: 'TBD',
        description: 'davon Darlehenszinsaufwand',
        unit: 'EUR',
        digits: 2,
        importance: 'second'
      },
      {
        name: 'totalloanwinterest',
        tooltip: 'TBD',
        description: 'Rückzahlungsaufwand insgesamt',
        unit: 'EUR',
        digits: 2,
        importance: 'first'
      },
      {
        name: 'savingratio',
        tooltip: 'TBD',
        description: 'Ansparquote',
        unit: '%',
        digits: 2,
        importance: 'second'
      },
      {
        name: 'totalloanpays',
        tooltip: 'TBD',
        description: 'Anzahl Darlehensraten',
        unit: '',
        digits: 1,
        importance: 'second'
      },
      {
        name: 'initialfee',
        tooltip: 'TBD',
        description: 'Verrechnete Abschlussgebühr',
        unit: 'EUR',
        digits: 2,
        importance: 'second'
      },
      {
        name: 'initialpay',
        tooltip: 'TBD',
        description: 'davon Sondereinzahlung',
        unit: 'EUR',
        digits: 2,
        importance: 'second'
      },
      {
        name: 'irrsave',
        description: 'Effektiver Jahreszins/IRR Ansparphase',
        unit: '% p. a.',
        digits: 2,
        importance: 'second',
        tooltip: 'Dieses Feld gibt den effektiven Jahreszins an. Dieser entspricht der Effektivverzinsung bzw. dem internen Zinsfuß (internal rate of return) normalisiert auf ein Jahr.'
      },
      {
        name: 'irrloan',
        description: 'Effektiver Jahreszins/IRR Rückzahlungsphase',
        unit: '% p. a.',
        digits: 2,
        importance: 'second',
        tooltip: 'Dieses Feld gibt den effektiven Jahreszins an. Dieser entspricht der Effektivverzinsung bzw. dem internen Zinsfuß (internal rate of return) normalisiert auf ein Jahr.'
      }
    ]
  
  });
  
  
  
  homesave.save(function (err) {
    if (err) {
      console.log(err);
      console.log('Seed Failed for Calc.Elem.Model.Homesave');
      return next(err);
    } else {
      console.log('Calc.Elem.Model.Homesave successfully seeded');
    }
  });
  
  
  
  /**
   * SEED PROPERTY-PROPERTYPRICE
   * */
  var propertyprice = new Calc({
    name: 'propertyprice',
    id: 'property-propertyprice',
    designation: 'Bausparrechner',
    description: 'Mit dem Immobilienpreisrechner können Sie den maximalen Preis berechnen, den Sie für eine Immobilie zahlen können.',
    inputs: [
      {
        name: 'rent',
        id: 'property-propertyprice-rent',
        linetop: false,
        optional: false,
        label: 'Mietersparnis',
        placeholder: 'Mietersparnis',
        addon: 'EUR/Monat',
        value: '800.00',
        tooltip: 'Geben Sie hier die monatlichen Mietkosten ein, welche Sie durch den Kauf und die anschließende Eigennutzung der Immobilie sparen würden. Eine gute Annährung für die Mietersparnis ist die monatliche Warmmiete. Vergessen Sie anschließend nicht, die laufenden Kosten und Instandhaltungskosten einer erworbenen Immobilie im entsprechenden Eingabefeld anzugeben.',
        type: 'number',
        vtype: 'number',
        args: [0,1000000]
      },
      {
        name: 'income',
        id: 'property-propertyprice-income',
        linetop: false,
        optional: false,
        label: 'Zusätzliches frei verfügbares Einkommen',
        placeholder: 'Verfügbares Einkommen',
        addon: 'EUR/Monat',
        value: '200.00',
        tooltip: 'Geben Sie hier das monatliche frei verfügbare Einkommen an, welches Sie nach Mietzahlung zur Verfügung haben und zusätzlich für eine Immobilienfinanzierung nutzen könnten.',
        type: 'number',
        vtype: 'number',
        args: [0, 1000000]
      },
      {
        name: 'maintenance',
        id: 'property-propertyprice-maintenance',
        linetop: false,
        optional: false,
        label: 'Laufende Kosten der Immobilie',
        placeholder: 'Laufende Kosten',
        addon: 'EUR / Monat',
        value: '120.00',
        tooltip: 'Geben Sie die monatlichen laufenden Kosten an, welche beim Erwerb einer Immobilie anfallen würden. Diese umfassen zum Beispiel Kosten für Energie (Heizung, Strom), Wasserversorung und Müllabfuhr.',
        type: 'number',
        vtype: 'number',
        args: [0,100000]
      },
      {
        name: 'interest',
        id: 'property-propertyprice-interest',
        linetop: false,
        optional: false,
        label: 'Darlehenszinssatz',
        placeholder: 'Darlehenszinssatz',
        addon: '% p. a.',
        value: '2.50',
        tooltip: 'Geben Sie den jährlichen nominalen Zinssatz ein, welchen Sie für eine Immobilienfinanzierung zahlen würden.',
        type: 'number',
        vtype: 'number',
        args: [0, 20]
      },
      {
        name: 'selection',
        id: 'property-propertyprice-selection',
        linetop: true,
        label: 'Vorgabe Darlehen',
        tooltip: 'Einer der beiden Parameter "anfängliche Tilgung" und "Darlehenslaufzeit" muss für die Berechnung vorgegeben werden. Wählen Sie aus, welchen der Parameter Sie vorgeben möchten.',
        type: 'select',
        vtype: 'number',
        options: [
          {
            id: '2',
            description: 'Anfängliche Tilgung',
          },
          {
            id: '3',
            description: 'Darlehenslaufzeit'
          },
        ]
      },
      {
        name: 'initrepay',
        id: 'property-propertyprice-initrepay',
        linetop: false,
        optional: false,
        secondary: true,
        label: 'Anfängliche Tilgung',
        placeholder: 'Anfängliche Tilgung',
        addon: '% p. a.',
        value: '1.50',
        tooltip: 'Geben Sie den prozentualen Anteil des Darlehensbetrags ein, der mit der ersten Tilgungsrate bezogen auf ein Jahr getilgt wird.',
        type: 'number',
        vtype: 'number',
        args: [0, 20]
      },
      {
        name: 'term',
        id: 'property-propertyprice-term',
        linetop: false,
        optional: false,
        secondary: true,
        hide: 'true',
        label: 'Darlehenslaufzeit',
        placeholder: 'Darlehenslaufzeit',
        addon: 'Jahre',
        value: '20',
        tooltip: 'Geben Sie die Laufzeit des Darlehens in Jahren an. Dies ist die Dauer der monatlich zu zahlenden gleichbleibenden Raten (Annuitäten) bis zur vollständigen Rückzahlung des Darlehens.',
        type: 'number',
        vtype: 'number',
        args: [0, 100]
      },
      {
        name: 'equity',
        id: 'property-propertyprice-equity',
        linetop: true,
        optional: false,
        secondary: false,
        label: 'Eigenkapital',
        placeholder: 'Eigenkapital',
        addon: 'EUR',
        value: '40000.00',
        tooltip: 'Geben Sie das zum Immobilienerwerb einmalig zur Verfügung stehende Kapital an.',
        type: 'number',
        vtype: 'number',
        args: [0, 100000000]
      },
      {
        name: 'notar',
        id: 'property-propertyprice-notar',
        linetop: false,
        optional: false,
        label: 'Notargebühr',
        placeholder: 'Notargebühr',
        addon: '%',
        value: '1.50',
        tooltip: 'Geben Sie die prozentualen Kosten für den Notar bezogen auf den Kaufpreis ein',
        type: 'number',
        vtype: 'number',
        args: [0,20]
      },
      {
        name: 'makler',
        id: 'property-propertyprice-makler',
        linetop: false,
        optional: false,
        label: 'Maklerprovision',
        placeholder: 'Maklerprovision',
        addon: '%',
        value: '4.50',
        tooltip: 'Geben Sie die prozentualen Kosten für den Makler bezogen auf den Kaufpreis ein',
        type: 'number',
        vtype: 'number',
        args: [0, 20]
      },
      {
        name: 'proptax',
        id: 'property-propertyprice-proptax',
        linetop: false,
        optional: false,
        label: 'Grunderwerbssteuer',
        placeholder: 'Grunderwerbssteuer',
        addon: '%',
        value: '5.50',
        tooltip: 'Geben Sie die Steuersatz für die Grunderwerbssteuer an. Dieser unterscheidet sich von Bundesland zu Bundesland. Maßgeblich für den anzuwendenden Steuersatz ist das Bundesland des Grundstücks, auf welchem die Immobilie steht.',
        type: 'number',
        vtype: 'number',
        args: [0, 20]
      }
    ],
    results_1: [
      {
        name: 'rate',
        tooltip: 'Die maximale monatliche Rate zur Rückzahlung des Darlehens (Zins und Tilgung), welche aus dem monatlichen Einkommensüberschüssen höchstens finanziert werden kann. Die Rate setzt sich zusammen aus Mietersparnis und zusätzlichem frei verfügbaren Einkommen, vermindert um die laufenden Kosten der neuen Immobilie.',
        description: 'Monatsrate',
        unit: 'EUR',
        digits: 2,
        importance: 'second'
      },
      {
        name: 'loan',
        tooltip: 'Der höchstmögliche Darlehensbetrag berechnet aus den Eingabeparametern. Dieser Darlehensbetrag zusammen mit dem Eigenkapital ergibt die Gesamtkosten der Immobilie, welche man in diesem Szenario gerade noch finanzieren kann.',
        description: 'Darlehensbetrag',
        unit: 'EUR',
        digits: 2,
        importance: 'second'
      },
      {
        name: 'term',
        tooltip: 'Die Dauer bis zur vollständigen Rückzahlung des Darlehens mit Zins und Tilgung.',
        description: 'Darlehenslaufzeit',
        unit: 'Jahre',
        digits: 2,
        importance: 'second'
      },
      {
        name: 'initrepay',
        tooltip: 'Der prozentuale Anteil des Darlehensbetrags, der mit der ersten Tilgungsrate bezogen auf ein Jahr getilgt wird',
        description: 'Anfängliche Tilgung',
        unit: '%',
        digits: 2,
        importance: 'second'
      },
      {
        name: 'interest',
        tooltip: 'Der gesamte für das Darlehen entstehende Zinsaufwand. Der Zinsaufwand ist die Summe aller in den Monatsraten enthaltenen Zinsszahlungen für das Darlehen.',
        description: 'Zinsaufwand',
        unit: 'EUR',
        digits: 2,
        importance: 'second'
      },
      {
        name: 'totalpropcost',
        tooltip: 'Die Gesamtkosten der Immobilien, bestehend aus Kaufpreis, Notargebühren, Maklerprovisionen sowie Grunderwerbssteuer.',
        description: 'Gesamtkosten der Immobilie',
        unit: 'EUR',
        digits: 2,
        importance: 'first'
      },
      {
        name: 'maxprice',
        tooltip: 'Der maximal finanzierbare Kaufpreis der Immobilie ohne Kosten wie Notargebühren, Maklerprovisionen und Grunderwerbssteuern. Der Betrag wird aus den Eingabeparametern berechnet und hängt maßgeblich ab vom Eigenkapital, der monatlich verfügbaren Darlehensrate (Monatsrate) sowie der anfänglichen Tilgung bzw. Laufzeit.',
        description: 'Höchstmöglicher Kaufpreis',
        unit: 'EUR',
        digits: 2,
        importance: 'first'
      },
      {
        name: 'notar',
        tooltip: 'Die prozentuale Gebühr für die Dienste des Notars bezogen auf den Kaufpreis.',
        description: 'Notargebühr',
        unit: 'EUR',
        digits: 2,
        importance: 'second'
      },
      {
        name: 'makler',
        tooltip: 'Die prozentuale Provision für den Makler bezogen auf den Kaufpreis.',
        description: 'Maklerprovision',
        unit: 'EUR',
        digits: 2,
        importance: 'second'
      },
      {
        name: 'proptax',
        tooltip: 'Die beim Kauf für Grundstück und Gebäude zu entrichtende Grunderwerbssteuer als Prozentsatz des Kaufpreises.',
        description: 'Grunderwerbssteuer',
        unit: 'EUR',
        digits: 2,
        importance: 'second'
      },
      {
        name: 'totalcost',
        tooltip: 'Der Gesamtaufwand setzt sich zusammen aus den gesamten Kosten der Immobilie sowie dem Zinsaufwand des Darlehens.',
        description: 'Gesamtaufwand des Immobilienerwerbs',
        unit: 'EUR',
        digits: 2,
        importance: 'first'
      }
    ]
    
  });
  
  
  propertyprice.save(function (err) {
    if (err) {
      console.log(err);
      console.log('Seed Failed for Calc.Elem.Model.Propertyprice');
      return next(err);
    } else {
      console.log('Calc.Elem.Model.Propertyprice successfully seeded');
    }
  });
  
  
    
  /**
   * SEED PROPERTY-REPAYSURROGAT
   * */
  var repaysurrogat = new Calc({
    name: 'repaysurrogat',
    id: 'property-repaysurrogat',
    designation: 'Tilgungssurrogatrechner',
    description: 'Mit dem Tilgungssurrogatrechner können Sie bestimmen, ob eine Tilgungsaussetzung und Wandlung eines Annuitätendarlehens in ein endfälliges Darlehen bei gleichzeitiger Anlage der überschüssigen Mittel zu einem finanziellen Vorteil führt.',
    inputs: [
      {
        name: 'principal',
        id: 'debt-repaysurrogat-principal',
        linetop: false,
        optional: false,
        label: 'Darlehensbetrag',
        placeholder: 'Darlehensbetrag',
        addon: 'EUR',
        value: '150000.00',
        tooltip: 'Geben Sie die Höhe des Darlehens bzw. die Kreditsumme an.',
        type: 'number',
        vtype: 'number',
        args: [0, 1000000000]
      },
      {
        name: 'debtinterest',
        id: 'debt-repaysurrogat-debtinterest',
        linetop: false,
        optional: false,
        label: 'Darlehenszinssatz',
        placeholder: 'Darlehenszinssatz',
        addon: '% p. a.',
        value: '3.69',
        tooltip: 'Geben Sie den jährlichen nominalen Zinssatz ein, welcher für das Darlehen zu zahlen ist.',
        type: 'number',
        vtype: 'number',
        args: [0, 20]
      },
      {
        name: 'interval',
        id: 'debt-repaysurrogat-interval',
        linetop: false,
        label: 'Zahlungsintervall',
        tooltip: 'Geben Sie das Zeitintervall für die Ratenzahlungen an.',
        type: 'select',
        vtype: 'number',
        options: [
          {
            id: '12',
            description: 'monatlich'
          },
          {
            id: '4',
            description: 'vierteljährlich'
          },
          {
            id: '2',
            description: 'halbjährlich'
          },
          {
            id: '1',
            description: 'jährlich'
          }
        ]
      },
      {
        name: 'selection',
        id: 'debt-repaysurrogat-selection',
        linetop: true,
        label: 'Vorgabewert Darlehen',
        tooltip: 'Einer der Parameter "anfängliche Tilgung", "Darlehenslaufzeit" oder "Darlehensrate" muss für die Berechnung vorgegeben werden. Wählen Sie aus, welchen der Parameter Sie vorgeben möchten. Die anderen Parameter werden entsprechend berechnet.',
        type: 'select',
        vtype: 'number',
        options: [
          {
            id: '2',
            description: 'Anfängliche Tilgung'
          },
          {
            id: '3',
            description: 'Darlehenslaufzeit'
          },
          {
            id: '4',
            description: 'Darlehensrate'
          }
        ]
      },
      {
        name: 'initrepay',
        id: 'debt-repaysurrogat-initrepay',
        linetop: false,
        optional: false,
        secondary: true,
        label: 'Tilgungssatz',
        placeholder: 'Tilgungssatz',
        addon: '% p. a.',
        value: '1.60',
        tooltip: 'Geben Sie den prozentualen Anteil des Darlehensbetrags ein, der mit der ersten Tilgungsrate bezogen auf ein Jahr getilgt wird.',
        type: 'number',
        vtype: 'number',
        args: [0, 20]
      },
      {
        name: 'term',
        id: 'debt-repaysurrogat-term',
        linetop: false,
        optional: false,
        secondary: true,
        hide: 'true',
        label: 'Darlehenslaufzeit',
        placeholder: 'Darlehenslaufzeit',
        addon: 'Jahre',
        value: '20',
        tooltip: 'Geben Sie die Laufzeit des Darlehens in Jahren an. Dies ist die Dauer der monatlich zu zahlenden gleichbleibenden Raten (Annuitäten) bis zur vollständigen Rückzahlung des Darlehens.',
        type: 'number',
        vtype: 'number',
        args: [0, 100]
      },
      {
        name: 'repay',
        id: 'debt-repaysurrogat-repay',
        linetop: false,
        optional: false,
        secondary: true,
        hide: 'true',
        label: 'Darlehensrate',
        placeholder: 'Darlehensrate',
        addon: 'EUR',
        value: '500',
        tooltip: 'TBD',
        type: 'number',
        vtype: 'number',
        args: [0, 10000000]
      },
      {
        name: 'saveinterest',
        id: 'debt-repaysurrogat-saveinterest',
        linetop: true,
        optional: false,
        label: 'Guthabenzinssatz',
        placeholder: 'Guthabenzinssatz',
        addon: '% p. a.',
        value: '6.00',
        tooltip: 'Geben Sie den jährlichen Zinssatz des Anlageproduktes ein, in welches die monatliche Überschüsse/Tilgungsersatzanteile investiert werden.',
        type: 'number',
        vtype: 'number',
        args: [0, 20]
      },
      {
        name: 'taxes',
        id: 'debt-repaysurrogat-taxes',
        linetop: true,
        label: 'Steuern berücksichtigen?',
        tooltip: 'Wählen Sie ja, um Steuerabzüge auf Kapitalerträge bei der Berechnung zu berücksichtigen.',
        type: 'select',
        vtype: 'boolean',
        options: [
          {
            id: 'false',
            description: 'Nein'
          },
          {
            id: 'true',
            description: 'Ja'
          }
        ]
      },
      {
        name: 'taxrate',
        id: 'debt-repaysurrogat-taxrate',
        linetop: false,
        optional: false,
        secondary: true,
        hide: 'true',
        label: 'Steuersatz',
        placeholder: 'Steuersatz',
        addon: '% p. a.',
        value: '26.375',
        tooltip: 'Geben Sie den prozentualen Steuersatz an, mit welchem die Kapitalerträge nach Abzug des Freibetrages belastet werden.',
        type: 'number',
        vtype: 'number',
        args: [0, 75]
      },
      {
        name: 'taxfree',
        id: 'debt-repaysurrogat-taxfree',
        linetop: false,
        optional: false,
        secondary: true,
        hide: 'true',
        label: 'Jährlicher Freibetrag',
        placeholder: 'Freibetrag',
        addon: 'EUR',
        value: '801.00',
        tooltip: 'Geben Sie den jährlichen Steuerfreibetrag an. In Deutschland beträgt der Freibetrag 801.00 EUR für Ledige und 1.602.00 EUR für Verheiratete.',
        type: 'number',
        vtype: 'number',
        args: [0, 100000]
      },
      {
        name: 'taxtime',
        id: 'debt-repaysurrogat-taxtime',
        linetop: false,
        optional: false,
        secondary: true,
        hide: 'true',
        label: 'Versteuerungszeitpunkt',
        tooltip: 'Wählen Sie, ob die Kapitalerträge jährlich oder einmalig zum Laufzeitende besteuert werden sollen.',
        type: 'select',
        vtype: 'boolean',
        options: [
          {
            id: 'false',
            description: 'jährlich'
          },
          {
            id: 'true',
            description: 'Laufzeitende'
          }
        ]
      }
    ],
    results_1: [
      {
        name: 'totalcost',
        tooltip: 'Die Summe aller während der Laufzeit anfallenden Zahlungen, welche sich aus dem Produkt von Darlehensrate und Anzahl der Zahlung ergibt.',
        description: 'Gesamtkosten Darlehen',
        unit: 'EUR',
        digits: 2,
        importance: 'first'
      },
      {
        name: 'debtinterest',
        tooltip: 'Die Summe aller während der Laufzeit anfallenden Zinszahlungen, welche in der Darlehensrate enthalten sind.',
        description: 'davon Zinsaufwand',
        unit: 'EUR',
        digits: 2,
        importance: 'second'
      },
      {
        name: 'repaysubstitute',
        tooltip: 'Die Summe aller Tilgungszahlungen, welche bei Tilgungsaussetzung in ein Anlageprodukt investiert werden können.',
        description: 'davon Tilgungssurrogat',
        unit: 'EUR',
        digits: 2,
        importance: 'second'
      },
      {
        name: 'annuity',
        tooltip: 'TBD',
        description: 'Darlehensrate',
        unit: 'EUR',
        digits: 2,
        importance: 'second'
      },
      {
        name: 'repayrate',
        tooltip: 'TBD',
        description: 'Tilgungssatz',
        unit: '%',
        digits: 2,
        importance: 'second'
      },
      {
        name: 'term',
        tooltip: 'TBD',
        description: 'Darlehenslaufzeit',
        unit: 'Jahre',
        digits: 2,
        importance: 'second'
      },
      {
        name: 'interestgain',
        tooltip: 'TBD',
        description: 'Zinsertrag',
        unit: 'EUR',
        digits: 2,
        importance: 'second'
      },
      {
        name: 'terminalvalue',
        tooltip: 'TBD',
        description: 'Endwert Anlagekapital',
        unit: 'EUR',
        digits: 2,
        importance: 'first'
      },
      {
        name: 'pnlcategory',
        tooltip: 'TBD',
        description: 'Tilgungsaussetzung lohnt sich?',
        unit: '',
        type: 'string',
        importance: 'first'
      },
      {
        name: 'pnlpos',
        tooltip: 'TBD',
        description: 'Finanzieller Vorteil',
        unit: 'EUR',
        digits: 2,
        importance: 'first'
      },
      {
        name: 'pnlneg',
        tooltip: 'TBD',
        description: 'Finanzieller Nachteil',
        unit: 'EUR',
        digits: 2,
        importance: 'first'
      },
      {
        name: 'taxdeduct',
        tooltip: 'TBD',
        description: 'Steuerabzug',
        unit: 'EUR',
        digits: 2,
        importance: 'second'
      },
      {
        name: 'terminalwotax',
        tooltip: 'TBD',
        description: 'Endwert nach Steuern',
        unit: 'EUR',
        digits: 2,
        importance: 'second'
      }
    ]
  });
  
  
  
  repaysurrogat.save(function (err) {
    if (err) {
      console.log(err);
      console.log('Seed Failed for Calc.Elem.Model.Repaysurrogat');
      return next(err);
    } else {
      console.log('Calc.Elem.Model.Repaysurrogat successfully seeded');
    }
  });
  
  
  
  /**
   * SEED DEPOSITS-TIMEDEPOSIT
   * */
  var timedeposit = new Calc({
    name: 'timedeposit',
    id: 'deposits-timedeposit',
    designation: 'Festgeldrechner',
    description: 'Mit dem Festgeldrechner können Sie den Endwert sowie wahlweise Zinsertrag, Anlagesumme, Zinssatz oder Laufzeit für eine Festgeldanlage bestimmen. Auch Steuern auf die erzielten Erträge können mit dem Rechner berücksichtigt werden.',
    inputs: [
      {
        name: 'calcselect',
        id: 'deposits-timedeposit-calcselect',
        label: 'Was soll berechnet werden?',
        tooltip: 'Wählen Sie hier aus, welche der Größen Zinsertrag, Anlagesumme, Zinssatz oder Laufzeit berechnet werden soll. Der Rechner wird das Eingabefeld für die zu berechnende Größe dann ausblenden und genau diese Größe berechnen.',
        type: 'select',
        vtype: 'number',
        args: [2, 5],
        options: [
          {
            id: '2',
            description: 'Zinsertrag'
          },
          {
            id: '3',
            description: 'Anlagesumme'
          },
          {
            id: '4',
            description: 'Zinssatz'
          },
          {
            id: '5',
            description: 'Laufzeit'
          }
        ]
      },
      {
        name: 'principal',
        id: 'deposit-timedeposit-principal',
        linetop: false,
        optional: false,
        label: 'Anlagesumme',
        placeholder: 'Anlagesumme',
        addon: 'EUR',
        value: '50000.00',
        tooltip: 'Geben Sie den Geldbetrag an, welcher angelegt werden soll.',
        type: 'number',
        vtype: 'number',
        args: [0, 100000000000]
      },
      {
        name: 'interest',
        id: 'deposits-timedeposit-interest',
        linetop: false,
        optional: false,
        label: 'Zinssatz',
        placeholder: 'Zinssatz',
        addon: '% p. a.',
        value: '2.50',
        tooltip: 'Geben Sie den jährlichen nominalen Zinssatz ein, mit welchem das Kapital verzinst wird.',
        type: 'number',
        vtype: 'number',
        args: [0.000001, 20]
      },
      {
        name: 'term',
        id: 'deposits-timedeposit-term',
        linetop: false,
        optional: false,
        label: 'Laufzeit',
        placeholder: 'Laufzeit',
        addon: 'Monate',
        value: '8',
        tooltip: 'Geben Sie die Laufzeit der Festgeldanlage an. Über diese Laufzeit wird die Anlagesumme entsprechend dem Zinssatz verzinst.',
        type: 'number',
        vtype: 'number',
        args: [0, 1200]
      },
      {
        name: 'interestgain',
        id: 'deposits-timedeposit-interestgain',
        linetop: false,
        optional: false,
        disabled: true,
        label: 'Zinsertrag',
        placeholder: 'Zinsertrag',
        addon: 'EUR',
        tooltip: 'Geben Sie den Zinsertrag an, welchen die angegebene Festgeldanlage erzielt.',
        type: 'number',
        vtype: 'number',
        args: [0.000001, 100000000]
      },
      {
        name: 'selection',
        id: 'deposits-timedeposit-selection',
        linetop: false,
        optional: false,
        label: 'Behandlung der Zinserträge',
        tooltip: 'Geben Sie an, ob die Zinserträge jedes Jahr ausgezahlt und nicht weiter verzinst werden (Auszahlung) oder ob sie jedes Jahr der Anlagesumme zugeschlagen (Einbehaltung) und fortan mit verzinst werden. Wie bei gewöhnlichen Festgeldverträgen wendet der Rechner unterjährig die lineare Verzinsung an.',
        type: 'select',
        vtype: 'bool',
        options: [
          {
            id: 'false',
            description: 'Auszahlung, kein Zinseszins'
          },
          {
            id: 'true',
            description: 'Einbehaltung, Zinseszins'
          }
        ]
      },
      {
        name: 'taxes',
        id: 'deposits-timedeposit-taxes',
        linetop: true,
        label: 'Steuern berücksichtigen?',
        tooltip: 'Wählen Sie ja, um Steuerabzüge auf Kapitalerträge bei der Berechnung zu berücksichtigen.',
        type: 'select',
        vtype: 'bool',
        options: [
          {
            id: 'false',
            description: 'Nein'
          },
          {
            id: 'true',
            description: 'Ja'
          }
        ]
      },
      { 
        name: 'taxrate', 
        id: 'deposits-timedeposit-taxrate',
        linetop: false,
        optional: false,
        secondary: true,
        hide: 'true',
        label: 'Steuersatz',
        placeholder: 'Steuersatz',
        addon: '% p. a.',
        value: '26.375',
        tooltip: 'Geben Sie den prozentualen Steuersatz an, mit welchem die Kapitalerträge nach Abzug des Freibetrages belastet werden.',
        type: 'number',
        vtype: 'number',
        args: [0, 75]
      },
      { 
        name: 'taxfree', 
        id: 'deposits-timedeposit-taxfree',
        linetop: false,
        optional: false,
        secondary: true,
        hide: 'true',
        label: 'Jährlicher Freibetrag',
        placeholder: 'Freibetrag',
        addon: 'EUR',
        value: '801.00',
        tooltip: 'Geben Sie den jährlichen Steuerfreibetrag an. In Deutschland beträgt der Freibetrag 801.00 EUR für Ledige und 1.602.00 EUR für Verheiratete.',
        type: 'number',
        vtype: 'number',
        args: [0, 100000]
      },
      { 
        name: 'taxtime', 
        id: 'deposits-timedeposit-taxtime',
        linetop: false,
        optional: false,
        secondary: true,
        hide: 'true',
        label: 'Versteuerungszeitpunkt',
        tooltip: 'Wählen Sie, ob die Zinserträge jährlich oder einmalig zum Laufzeitende besteuert werden sollen. Im Normalfall würde man bei jährlicher Auszahlung der Zinserträge auch einen jährlichen Versteuerungszeitpunkt wählen. Bei Einbehaltung der Erträge dagegen fällt der Versteuerungszeitpunkt in der Regel auf das Laufzeitende.',
        type: 'select',
        vtype: 'bool',
        options: [
          {
            id: 'false',
            description: 'jährlich'
          },
          {
            id: 'true',
            description: 'Laufzeitende'
          }
        ]
      }
    ],
    results_1: [
      {
        name: 'interestgain',
        tooltip: 'Der gesamte über die Anlagedauer entstehende Zinsertrag.',
        description: 'Zinsertrag',
        unit: 'EUR',
        digits: 2,
        importance: 'first'
      },
      {
        name: 'interestgainwotax',
        tooltip: 'Der gesamte über die Anlagedauer entstehende Zinsertrag vor Abzug der Steuern.',
        description: 'Zinsertrag vor Steuern',
        unit: 'EUR',
        digits: 2,
        importance: 'second'
      },
      {
        name: 'terminalvalue',
        tooltip: 'Der Wert der Anlagesumme am Ende der Laufzeit, bestehend aus der Anlagesumme und dem Zinsertrag.',
        description: 'Endwert',
        unit: 'EUR',
        digits: 2,
        importance: 'first'
      },
      {
        name: 'principal',
        tooltip: 'Die Anlagesumme, welche unter den angegebenen Parametern zur Erzielung des vorgegebenen Zinsertrags notwendig ist.',
        description: 'Anlagesumme',
        unit: 'EUR',
        digits: 2,
        importance: 'first'
      },
      {
        name: 'interest',
        tooltip: 'Der jährliche Zinssatz, welcher unter den angegebenen Parametern zur Erzielung des vorgegebenen Zinsertrags notwendig ist.',
        description: 'Zinssatz',
        unit: '% p. a.',
        digits: 4,
        importance: 'first'
      },
      {
        name: 'term',
        tooltip: 'Die Laufzeit, welcher unter den angegebenen Parametern zur Erzielung des vorgegebenen Zinsertrags notwendig ist.',
        description: 'Laufzeit',
        unit: 'Monate',
        digits: 3,
        importance: 'first'
      },
      {
        name: 'taxes',
        tooltip: 'Der Gesamtwert aller über die Anlagelaufzeit zu leistenden Steuerzahlungen unter Berücksichtigung des jährlichen Steuerfreibetrages und des Steuersatzes.',
        description: 'Steuerlast',
        unit: 'EUR',
        digits: 2,
        importance: 'second'
      }
    ]
  
  });
  
  
  
  timedeposit.save(function (err) {
    if (err) {
      console.log(err);
      console.log('Seed Failed for Calc.Elem.Model.Timedeposit');
      return next(err);
    } else {
      console.log('Calc.Elem.Model.Timedeposit successfully seeded');
    }
  });
  
    
  
  /**
   * SEED DEPOSITS-SAVINGSCHEME
   * */
  var savingscheme = new Calc({
    name: 'savingscheme',
    id: 'deposits-savingscheme',
    designation: 'Zuwachssparrechner',
    description: 'Mit dem Zuwachssparrechner können Sie Guthabenentwicklung und Effektivzins eines Sparplanes zum Zuwachssparen berechnen.',
    inputs: [
      {
        name: 'calcselect',
        id: 'deposits-savingscheme-calcselect',
        label: 'Was soll berechnet werden?',
        tooltip: 'Wählen Sie hier aus, ob die Anlagesumme oder der Endwert berechnet werden soll. Der Rechner wird das Eingabefeld für die zu berechnende Größe dann ausblenden und genau diese Größe berechnen.',
        type: 'select',
        vtype: 'number',
        args: [2, 3],
        options: [
          {
            id: '2',
            description: 'Endwert'
          },
          {
            id: '3',
            description: 'Anlagesumme'
          }
        ]
      },
      {
        name: 'principal',
        id: 'deposits-savingscheme-principal',
        label: 'Anlagesumme',
        addon: 'EUR',
        placeholder: 'Anlagesumme',
        value: '10000',
        tooltip: 'Geben Sie den Geldbetrag an, welcher angelegt werden soll.',
        type: 'number',
        vtype: 'number',
        args: [0,1000000000]
      },
      {
        name: 'terminal',
        id: 'deposits-savingscheme-terminal',
        label: 'Endwert',
        addon: 'EUR',
        placeholder: 'Endwert',
        disabled: true,
        value: '',
        tooltip: 'Der Wert der Anlagesumme am Ende der Laufzeit, bestehend aus der anfänglichen Anlagesumme sowie dem Zinsertrag, ggf. nach Steuern.',
        type: 'number',
        vtype: 'number',
        args: [0,1000000000]
      },
      {
        name: 'term',
        id: 'deposits-savingscheme-term',
        linetop: true,
        label: 'Laufzeit des Sparplans (Jahre)',
        placeholer: 'Laufzeit (Jahre)',
        tooltip: 'Geben Sie hier die Laufzeit des Sparplans in Jahren an. Über diese Laufzeit wird die Anlagesumme entsprechend der jährlichen Zinssätze verzinst. Nach Eingabe der Laufzeit können Sie die jährlichen Zinssätze eingeben. Beim Zuwachssparen sind diese meist von Jahr zu Jahr ansteigend.',
        type: 'select',
        vtype: 'number',
        args: [0, 25],
        options: [
          {
            id: '0',
            description: '0'
          },
          {
            id: '1',
            description: '1'
          },
          {
            id: '2',
            description: '2'
          },
          {
            id: '3',
            description: '3'
          },
          {
            id: '4',
            description: '4'
          },
          {
            id: '5',
            description: '5'
          },
          {
            id: '6',
            description: '6'
          },
          {
            id: '7',
            description: '7'
          },
          {
            id: '8',
            description: '8'
          },{
            id: '9',
            description: '9'
          },
          {
            id: '10',
            description: '10'
          },
          {
            id: '11',
            description: '11'
          },
          {
            id: '12',
            description: '12'
          },
          {
            id: '13',
            description: '13'
          },
          {
            id: '14',
            description: '14'
          },
          {
            id: '15',
            description: '15'
          },
          {
            id: '16',
            description: '16'
          },
          {
            id: '17',
            description: '17'
          },
          {
            id: '18',
            description: '18'
          },
          {
            id: '19',
            description: '19'
          },
          {
            id: '20',
            description: '20'
          },
          {
            id: '21',
            description: '21'
          },
          {
            id: '22',
            description: '22'
          },
          {
            id: '23',
            description: '23'
          },
          {
            id: '24',
            description: '24'
          },
          {
            id: '25',
            description: '25'
          }
        ]
      },
      {
        name: 'interest',
        id: 'deposits-savingscheme-interest',
        type: 'custom',
        vtype: 'number',
        args: [0,30],
        label: 'Zinssatz',
        optional: false,
        array: 'true',
        arrayParent: 'term'
      },
      {
        name: 'interestselection',
        id: 'deposits-savingscheme-interestselection',
        linetop: true,
        optional: false,
        label: 'Behandlung der Zinserträge',
        tooltip: 'Geben Sie an, ob die Zinserträge jedes Jahr ausgezahlt und nicht weiter verzinst werden (Auszahlung) oder ob sie jedes Jahr der Anlagesumme zugeschlagen (Einbehaltung) und fortan mit verzinst werden. Wie bei gewöhnlichen Festgeldverträgen wendet der Rechner unterjährig die lineare Verzinsung an.',
        type: 'select',
        vtype: 'bool',
        options: [
          {
            id: 'true',
            description: 'Einbehaltung, Zinseszins'
          },
          {
            id: 'false',
            description: 'Auszahlung, kein Zinseszins'
          }
        ]
      },
      {
        name: 'taxes',
        id: 'deposits-savingscheme-taxes',
        linetop: true,
        label: 'Steuern berücksichtigen?',
        tooltip: 'Wählen Sie ja, um Steuerabzüge auf Kapitalerträge bei der Berechnung zu berücksichtigen.',
        type: 'select',
        vtype: 'bool',
        options: [
          {
            id: 'false',
            description: 'Nein'
          },
          {
            id: 'true',
            description: 'Ja'
          }
        ]
      },
      {
        name: 'taxrate',
        id: 'deposits-savingscheme-taxrate',
        linetop: false,
        optional: false,
        secondary: true,
        hide: 'true',
        label: 'Steuersatz',
        placeholder: 'Steuersatz',
        addon: '% p. a.',
        value: '26.375',
        tooltip: 'Geben Sie den prozentualen Steuersatz an, mit welchem die Kapitalerträge nach Abzug des Freibetrages belastet werden.',
        type: 'number',
        vtype: 'number',
        args: [0, 75]
      },
      {
        name: 'taxfree',
        id: 'deposits-savingscheme-taxfree',
        linetop: false,
        optional: false,
        secondary: true,
        hide: 'true',
        label: 'Jährlicher Freibetrag',
        placeholder: 'Freibetrag',
        addon: 'EUR',
        value: '801.00',
        tooltip: 'Geben Sie den jährlichen Steuerfreibetrag an. In Deutschland beträgt der Freibetrag 801.00 EUR für Ledige und 1.602.00 EUR für Verheiratete.',
        type: 'number',
        vtype: 'number',
        args: [0, 100000]
      },
      { 
        name: 'taxtime', 
        id: 'deposits-savingscheme-taxtime',
        linetop: false,
        optional: false,
        secondary: true,
        hide: 'true',
        label: 'Versteuerungszeitpunkt',
        tooltip: 'Wählen Sie, ob die Zinserträge jährlich oder einmalig zum Laufzeitende besteuert werden sollen. Im Normalfall würde man bei jährlicher Auszahlung der Zinserträge auch einen jährlichen Versteuerungszeitpunkt wählen. Bei Einbehaltung der Erträge dagegen fällt der Versteuerungszeitpunkt in der Regel auf das Laufzeitende.',
        type: 'select',
        vtype: 'bool',
        options: [
          {
            id: 'false',
            description: 'jährlich'
          },
          {
            id: 'true',
            description: 'Laufzeitende'
          }
        ]
      }
    ],
    results_1: [
      {
        name: 'terminalmain',
        description: 'Endwert inkl. Zinsen',
        unit: 'EUR',
        digits: 2,
        importance: 'first',
        tooltip: 'Der Wert der Anlagesumme am Ende der Laufzeit, bestehend aus der anfänglichen Anlagesumme und dem Zinsertrag.'
      },
      {
        name: 'terminal',
        description: 'Endwert inkl. Zinsen',
        unit: 'EUR',
        digits: 2,
        importance: 'second',
        tooltip: 'Der Wert der Anlagesumme am Ende der Laufzeit, bestehend aus der anfänglichen Anlagesumme und dem Zinsertrag.'
      },
      {
        name: 'principal',
        description: 'Anlagesumme',
        unit: 'EUR',
        digits: 2,
        importance: 'second',
        tooltip: 'Der angelegte bzw. anzulegende Geldbetrag.'
      },
      {
        name: 'principalmain',
        description: 'Anlagesumme',
        unit: 'EUR',
        digits: 2,
        importance: 'first',
        tooltip: 'Der angelegte bzw. anzulegende Geldbetrag.'
      },
      {
        name: 'interest',
        description: 'Zinsertrag',
        unit: 'EUR',
        digits: 2,
        importance: 'second',
        tooltip: 'Der gesamte über die Laufzeit entstehende Zinsertrag.'
      },
      {
        name: 'taxes',
        description: 'Steuerlast',
        unit: 'EUR',
        digits: 2,
        importance: 'second',
        tooltip: 'Die gesamte über die Laufzeit entstehende Steuerlast.'
      },
      {
        name: 'averageinterest',
        description: 'Durchschnittlicher jährlicher Zinssatz',
        unit: '% p. a.',
        digits: 3,
        importance: 'first',
        tooltip: 'Das einfache arithmetische Mittel der jährlichen Zinssätze.'
      },
      {
        name: 'linearinterest',
        description: 'Durchschnittliche lineare Rendite',
        unit: '% p. a.',
        digits: 3,
        importance: 'first',
        tooltip: 'Diese Rendite gibt den durchschnittlichen jährliche Wertzuwachs des Sparplans wieder. Sie berechnet sich als Rendite des durchschnittlichen jährlichen Zinsertrages relativ zur Anlagesumme.'
      },
      {
        name: 'effectiveinterest',
        description: 'Effektivzins / IRR',
        unit: '% p. a.',
        digits: 3,
        importance: 'first',
        tooltip: 'Die effektive jährliche Rendite des Sparplans, welche nach der Methode des internen Zinfußes (internal rate of return) berechnet wird. Diese Rendite kann interpretiert werden als eine mittlere jährliche Rendite der Sparanlage. Sie kann verwendet werden, um mehrere Sparalternativen zu vergleichen. Im Allgemeinen ist die Sparalternative mit dem höchsten Effektivzins auch die lukrativste.'
      }
    ]

  });


  savingscheme.save(function (err) {
    if (err) {
      console.log(err);
      console.log('Seed Failed for Calc.Elem.Model.Savingscheme');
      return next(err);
    } else {
      console.log('Calc.Elem.Model.Savingscheme successfully seeded');
    }
  });



  /**
   * SEED DEPOSITS-INTERESTPENALTY
   * */
  var interestpenalty = new Calc({
    name: 'interestpenalty',
    id: 'deposits-interestpenalty',
    designation: 'Vorschusszinsrechner',
    description: 'Mit dem Vorschusszinsrechner können die Zinsen berechnet werden, welche durch das Abheben eines größeren Geldbetrages vom Sparkonto ohne rechtzeitige vorherige Kündigung anfallen.',
    inputs: [
      {
        name: 'principal',
        id: 'deposits-interestpenalty-principal',
        label: 'Entnahmebetrag',
        addon: 'EUR',
        placeholder: 'Entnahmebetrag',
        value: '4000',
        tooltip: 'Geben Sie den Geldbetrag an, welchen Sie vom Sparkonto ohne vorherige Kündigung abheben möchten.',
        type: 'number',
        vtype: 'number',
        args: [0, 1000000000]
      },
      {
        name: 'interest',
        id: 'deposits-interestpenalty-interest',
        label: 'Anlagezinssatz',
        addon: '% p. a.',
        placeholder: 'Anlagezinssatz',
        value: '1.25',
        tooltip: 'Geben Sie den jährlichen Zinssatz an, welchen Sie auf das Sparguthaben erhalten.',
        type: 'number',
        vtype: 'number',
        args: [0,30]
      },
      {
        name: 'allowance',
        id: 'deposits-interestpenalty-allowance',
        label: 'Verbleibender Freibetrag',
        addon: 'EUR',
        placeholder: 'Verbleibender Freibetrag',
        value: '2000',
        tooltip: 'Geben Sie den Betrag ein, welchen Sie ohne vorherige Kündingung und ohne Zinsstrafe von ihrem Sparkonto abheben können. Auf diesen Betrag fallen entsprechend keine Vorschusszinsen an. Gewöhnlich beläuft sich der gesamte von der Bank eingeräumte Freibetrag auf monatlich 2000 EUR. Der verbleibende Freibetrag ist der eingeräumte Freibetrag abzüglich der bereits von Ihnen getätigten Auszahlungen im laufenden Monat.',
        type: 'number',
        vtype: 'number',
        args: [0, 1000000000]
      },
      {
        name: 'term',
        id: 'deposits-interestpenalty-term',
        label: 'Vorschusszinstage',
        addon: 'Tage',
        placeholder: 'Vorschusszinstage',
        value: '90',
        tooltip: 'Geben Sie die Anzahl der Zinstage ein, für welche Vorschusszinsen zu entrichten sind. Sofern Sie den Entnahmebetrag nicht gekündigt haben wird meist von 90 Zinstagen ausgegangen. Ansonsten entsprechen die Vorschusszinstage meist den Tagen zwischen gewünschter vorzeitiger Auszahlung und Vertragsende nach Kündigung.',
        type: 'number',
        vtype: 'number',
        args: [0,1000000000]
      },
      {
        name: 'factor',
        id: 'deposits-interestpenalty-factor',
        label: 'Zinsfaktor',
        addon: '%',
        placeholder: 'Zinsfaktor',
        value: '25.00',
        tooltip: 'Geben Sie den Anteil des Anlagezinssatzes an, welcher für die Berechnung der Vorschusszinsen angewandt wird. Meist beläuft sich dieser Anteil auf 25%.',
        type: 'number',
        vtype: 'number',
        args: [0, 100]
      },
      {
        name: 'interestdays',
        id: 'deposits-interestpenalty-interestdays',
        linetop: false,
        label: 'Jährliche Zinstage',
        placeholer: 'Jährliche Zinstage',
        tooltip: 'Geben Sie die Anzahl der für ein Jahr angenommenen Zinstage an. Für deutsche Sparkonten wird in der Regel die deutsche Zinsmethode genutzt, welche von 360 Zinstagen pro Jahr ausgeht.',
        type: 'select',
        vtype: 'number',
        args: [360, 366],
        options: [
          {
            id: '360',
            description: '360'
          },
          {
            id: '365',
            description: '365'
          },
          {
            id: '365.25',
            description: '365,25'
          }
        ]
      }
    ],
    results_1: [
      {
        name: 'interestpenalty',
        description: 'Vorschusszinsen',
        unit: 'EUR',
        digits: 2,
        importance: 'first',
        tooltip: 'Die zu zahlenden Vorschusszinsen.'
      },
      {
        name: 'interestprincipal',
        description: 'Zinsbelasteter Betrag',
        unit: 'EUR',
        digits: 2,
        importance: 'second',
        tooltip: 'Der Betrag, auf welchen Vorschusszinsen zu entrichten sind.'
      },
      {
        name: 'interest',
        description: 'Vorschusszinssatz',
        unit: '% p. a.',
        digits: 3,
        importance: 'second',
        tooltip: 'Der zugrundeliegende Zinssatz für die Berechnung der Vorschusszinsen.'
      }
    ]
  });



  interestpenalty.save(function (err) {
    if (err) {
      console.log(err);
      console.log('Seed Failed for Calc.Elem.Model.Interestpenalty');
      return next(err);
    } else {
      console.log('Calc.Elem.Model.Interestpenalty successfully seeded');
    }
  });



  /**
   * SEED PROPERTY-MORTGAGE
   * */
  var mortgage = new Calc({
    name: 'mortgage',
    id: 'property-mortgage',
    designation: 'Hypothekenrechner',
    description: 'Mit dem Hypothekenrechner können Sie zahlreiche Berechnungen zu Hypothekendarlehen durchführen.',
    inputs: [
      {
        name: 'select1',
        id: 'property-mortgage-select1',
        label: 'Was soll berechnet werden? - 1. Auswahl',
        tooltip: 'TBD',
        type: 'select',
        vtype: 'number',
        args: [1, 7],
        options: [
          {
            id: '1',
            description: 'Rate/Annuität'
          },
          {
            id: '2',
            description: 'Kreditsumme'
          },
          {
            id: '3',
            description: 'Zinssatz'
          },
          {
            id: '4',
            description: 'Anfängliche Tilgung'
          }
        ]
      },
      {
        name: 'select2',
        id: 'property-mortgage-select2',
        label: 'Was soll berechnet werden? - 2. Auswahl',
        tooltip: 'TBD',
        type: 'select',
        vtype: 'number',
        args: [1,4],
        'options': [
          {
            id: '1',
            description: 'Restschuld'
          },
          {
            id: '2',
            description: 'Laufzeit'
          },
          {
            id: '3',
            description: 'Jährliche Sondertilgung'
          }
        ]
      },
      {
        name: 'principal',
        id: 'property-mortgage-principal',
        label: 'Kreditsumme',
        addon: 'EUR',
        linetop: true,
        placeholder: 'Kreditsumme',
        value: '80000.00',
        tooltip: 'Geben Sie die Kredit- bzw. Darlehenssumme ein. Dies ist der Betrag, welcher bei Auszahlung des Kredites zur Verfügung gestellt wird.',
        type: 'number',
        vtype: 'number',
        args: [0,1000000000]
      },
      {
        name: 'fees',
        id: 'property-mortgage-fees',
        linetop: true,
        label: 'Sind Abschlussgebühren angefallen?',
        tooltip: 'TBD',
        type: 'select',
        vtype: 'bool',
        options: [
          {
            id: 'false',
            description: 'nein'
          },
          {
            id: 'true',
            description: 'ja'
          }
        ]
      },
      {
        name: 'feeamount',
        id: 'property-mortgage-feeamount',
        secondary: 'true',
        hide: 'true',
        label: 'Gebühren',
        addon: 'EUR',
        placeholder: 'Gebühren',
        value: '',
        tooltip: 'TBD',
        type: 'number',
        vtype: 'number',
        args: [0, 1000000000],
        optional: true
      },
      {
        name: 'feetype',
        id: 'property-mortgage-feetype',
        linetop: false,
        hide: true,
        secondary: 'true',
        label: 'Wie sollen die Gebühren verrechnet werden?',
        tooltip: 'TBD',
        type: 'select',
        vtype: 'number',
        optional: true,
        args: [2,3],
        options: [
          {
            id: '2',
            description: 'Verrechnung mit der Ratenzahlung/Annuität'
          },
          {
            id: '3',
            description: 'keine Verrechnung, sondern gesonderte Zahlung'
          }
        ]
      },
      {
        name: 'disagio',
        id: 'property-mortgage-disagio',
        label: 'Gab es ein Disagio?',
        tooltip: 'TBD',
        linetop: true,
        type: 'select',
        vtype: 'bool',
        options: [
          {
            id: 'false',
            description: 'nein'
          },
          {
            id: 'true',
            description: 'ja'
          }
        ]
      },
      {
        name: 'disagioamount',
        id: 'property-mortgage-disagioamount',
        secondary: 'true',
        hide: 'true',
        label: 'Disago',
        addon: '%',
        placeholder: 'Disago',
        value: '',
        tooltip: 'TBD',
        type: 'number',
        vtype: 'number',
        args: [0, 100],
        optional: true
      },
      {
        name: 'interest',
        id: 'property-mortgage-interest',
        label: 'Zinssatz',
        addon: '% p. a.',
        placeholder: 'Zinssatz',
        value: '3.50',
        tooltip: 'Geben Sie den gebundenen Sollzinssatz für das Darlehen ein. Dies ist der nominale Jahreszinssatz, welcher auf die jeweils ausstehenden Schulden angewandt wird.',
        type: 'number',
        vtype: 'number',
        args: [0, 100]
      },
      {
        name: 'initialinterest',
        id: 'property-mortgage-initialinterest',
        label: 'Anfängliche Tilgung',
        addon: '% p. a.',
        placeholder: 'Anfängliche Tilgung',
        value: '4.00',
        tooltip: 'Geben Sie den prozentualen Anteil des Darlehensbetrags ein, der mit der ersten Tilgungsrate bezogen auf ein Jahr getilgt wird.',
        type: 'number',
        vtype: 'number',
        args: [0, 100]
      },
      {
        name: 'repay',
        id: 'property-mortgage-repay',
        label: 'Rate/Annuität',
        addon: 'EUR',
        placeholder: 'Rate/Annuität',
        value: '',
        disabled: true,
        tooltip: 'TBD',
        type: 'number',
        vtype: 'number',
        args: [0,1000000000]
      },
      {
        name: 'repayfreq',
        id: 'property-mortgage-repayfreq',
        label: 'Zahlungsintervall für Rate',
        tooltip: 'TBD',
        type: 'select',
        vtype: 'number',
        args: [1, 12],
        options: [
          {
            id: '12',
            description: 'monatlich'
          },
          {
            id: '4',
            description: 'vierteljährlich'
          },
          {
            id: '2',
            description: 'halbjährlich'
          },
          {
            id: '1',
            description: 'jährlich'
          }
        ]
      },
      {
        name: 'term',
        id: 'property-mortgage-term',
        label: 'Laufzeit Ratenzahlungen',
        placeholder: 'Laufzeit Ratenzahlungen',
        value: '10',
        tooltip: 'TBD',
        type: 'numberselect',
        vtype: 'number',
        args: [0, 200],
        labelselect: 'Jahre',
        idselect: 'property-mortgage-termperiods',
        selectedoption: '1',
        options: [
          {
            id: '1',
            description: 'Jahre'
          },
          {
            id: '12',
            description: 'Monate'
          }
        ]
      },
      {
        name: 'repaymentfree',
        id: 'property-mortgage-repaymentfree',
        label: 'Gab es eine tilgungsfreie Zeit?',
        tooltip: 'TBD',
        linetop: true,
        type: 'select',
        vtype: 'bool',
        options: [
          {
            id: 'false',
            description: 'nein'
          },
          {
            id: 'true',
            description: 'ja'
          }
        ]
      },
      {
        name: 'repaymentfreeterm',
        id: 'property-mortgage-repaymentfreeterm',
        secondary: 'true',
        hide: 'true',
        label: 'Zeitraum',
        placeholder: 'Zeitraum',
        value: '',
        tooltip: 'TBD',
        type: 'numberselect',
        vtype: 'number',
        args: [0, 1000],
        optional: true,
        labelselect: 'Jahre',
        idselect: 'property-mortgage-repaymentfreetermperiods',
        selectedoption: '1',
        options: [
          {
            id: '1',
            description: 'Jahre'
          },
          {
            id: '12',
            description: 'Monate'
          }
        ]
      },
      {
        name: 'repaymentfreetype',
        id: 'property-mortgage-repaymentfreetype',
        linetop: false,
        hide: true,
        secondary: 'true',
        label: 'Wie sollen die Zinsen für die tilgungsfreie Zeit verrechnet werden?',
        tooltip: 'TBD',
        type: 'select',
        vtype: 'number',
        optional: true,
        args: [2, 3],
        options: [
          {
            id: '2',
            description: 'Verrechnung mit der Ratenzahlung/Annuität'
          },
          {
            id: '3',
            description: 'keine Verrechnung, sondern gesonderte Zahlung'
          }
        ]
      },
      {
        name: 'residual',
        id: 'property-mortgage-residual',
        label: 'Restschuld',
        addon: 'EUR',
        placeholder: 'Restschuld',
        value: '',
        disabled: true,
        tooltip: 'TBD',
        type: 'number',
        vtype: 'number',
        args: [0, 1000000000]
      },
      {
        name: 'annualrepay',
        id: 'property-mortgage-annualrepay',
        label: 'Jährliche Sondertilgung',
        addon: 'EUR',
        placeholder: 'Jährliche Sondertilgung',
        value: '0',
        tooltip: 'TBD',
        type: 'number',
        vtype: 'number',
        args: [0, 1000000000]
      },
      {
        name: 'followup',
        id: 'property-mortgage-followup',
        label: 'Anschlussfinanzierung berechnen?',
        tooltip: 'TBD',
        linetop: true,
        type: 'select',
        vtype: 'bool',
        options: [
          {
            id: 'false',
            description: 'nein'
          },
          {
            id: 'true',
            description: 'ja'
          }
        ]
      },
      {
        name: 'followupinterest',
        id: 'property-mortgage-followupinterest',
        secondary: 'true',
        hide: 'true',
        label: 'Zinssatz',
        addon: '% p. a.',
        placeholder: 'Zinssatz',
        value: '',
        tooltip: 'TBD',
        type: 'number',
        vtype: 'number',
        args: [0,100],
        optional: true
      },
      {
        name: 'specialrepay',
        id: 'property-mortgage-specialrepay',
        label: 'Gibt es individuelle Sondertilgungen?',
        tooltip: 'TBD',
        linetop: true,
        type: 'select',
        vtype: 'bool',
        options: [
          {
            id: 'false',
            description: 'nein'
          },
          {
            id: 'true',
            description: 'ja'
          }
        ]
      },
      {
        name: 'specialrepaypositions',
        id: 'property-mortgage-specialrepaypositions',
        linetop: false,
        hide: true,
        secondary: 'true',
        label: 'Wie viele Sondertilgungszeitpunkte gibt es?',
        tooltip: 'TBD',
        type: 'select',
        vtype: 'number',
        optional: true,
        args: [0, 30],
        options: [
          {
            id: '0',
            description: '0'
          },
          {
            id: '1',
            description: '1'
          },
          {
            id: '2',
            description: '2'
          },
          {
            id: '3',
            description: '3'
          },
          {
            id: '4',
            description: '4'
          },
          {
            id: '5',
            description: '5'
          },
          {
            id: '6',
            description: '6'
          },
          {
            id: '7',
            description: '7'
          },
          {
            id: '8',
            description: '8'
          },{
            id: '9',
            description: '9'
          },
          {
            id: '10',
            description: '10'
          },
          {
            id: '11',
            description: '11'
          },
          {
            id: '12',
            description: '12'
          },
          {
            id: '13',
            description: '13'
          },
          {
            id: '14',
            description: '14'
          },
          {
            id: '15',
            description: '15'
          },
          {
            id: '16',
            description: '16'
          },
          {
            id: '17',
            description: '17'
          },
          {
            id: '18',
            description: '18'
          },
          {
            id: '19',
            description: '19'
          },
          {
            id: '20',
            description: '20'
          },
          {
            id: '21',
            description: '21'
          },
          {
            id: '22',
            description: '22'
          },
          {
            id: '23',
            description: '23'
          },
          {
            id: '24',
            description: '24'
          },
          {
            id: '25',
            description: '25'
          },
          {
            id: '26',
            description: '26'
          },
          {
            id: '27',
            description: '27'
          },
          {
            id: '28',
            description: '28'
          },
          {
            id: '29',
            description: '29'
          },
          {
            id: '30',
            description: '30'
          }
        ]
      },
      {
        name: 'specialrepaymonths',
        id: 'property-mortgage-specialrepaymonths',
        type: 'custom',
        vtype: 'number',
        args: [0, 1200],
        label: 'Monat der Sondertilgung',
        optional: 'false',
        array: 'true',
        arrayParent: 'specialrepaypositions'
      },
      {
        name: 'specialrepayamount',
        id: 'property-mortgage-specialrepayamount',
        type: 'custom',
        vtype: 'number',
        args: [0, 1000000000],
        label: 'Betrag Sondertilgung',
        optional: 'false',
        array: 'true',
        arrayParent: 'specialrepaypositions'
      }
    ],
    results_1: [
      {
        name: 'repay',
        description: 'Rate/Annuität',
        unit: 'EUR',
        digits: 2,
        importance: 'first',
        tooltip: 'Die periodisch zu zahlendene konstante Rate zur Rückzahlung der Hypothek.'
      },
      {
        name: 'principal',
        description: 'Kreditsumme',
        unit: 'EUR',
        digits: 2,
        importance: 'first',
        tooltip: 'Der Betrag, auf welchen Vorschusszinsen zu entrichten sind.'
      },
      {
        name: 'interest',
        'description': 'Zinssatz',
        'unit': '% p. a.',
        'digits': 3,
        'importance': 'first',
        'tooltip': 'Der gebundene Sollzinssatz für das Darlehen.'
      },
      {
        name: 'initialinterest',
        description: 'Anfängliche Tilgung',
        unit: '% p. a.',
        digits: 3,
        importance: 'first',
        tooltip: 'Der prozentuale Anteil der Kreditsumme, welcher mit der ersten Tilgungsrate bezogen auf ein Jahr getilgt wird'
      },
      {
        name: 'residual',
        description: 'Restschuld',
        unit: 'EUR',
        digits: 2,
        importance: 'first',
        tooltip: 'TBD'
      },
      {
        name: 'totalrepay',
        description: 'Gesamte Rückzahlungen',
        unit: 'EUR',
        digits: 2,
        importance: 'first',
        tooltip: 'TBD'
      },
      {
        name: 'totalinterest',
        description: 'davon Zinslast',
        unit: 'EUR',
        digits: 2,
        importance: 'second',
        tooltip: 'TBD'
      },
      {
        name: 'totalreduction',
        description: 'davon Tilgung',
        unit: 'EUR',
        digits: 2,
        importance: 'second',
        tooltip: 'TBD'
      },
      {
        name: 'disagio',
        description: 'davon Disagio',
        unit: 'EUR',
        digits: 2,
        importance: 'second',
        tooltip: 'TBD'
      },
      {
        name: 'fees',
        description: 'davon Gebühren',
        unit: 'EUR',
        digits: 2,
        importance: 'second',
        tooltip: 'TBD'
      },
      {
        name: 'repaymentfreetotal',
        description: 'davon Zinslast tilgungsfreie Zeit',
        unit: 'EUR',
        digits: 2,
        importance: 'second',
        tooltip: 'TBD'
      },
      {
        name: 'irr',
        description: 'Effektiver Jahreszins/IRR',
        unit: '% p. a.',
        digits: 2,
        importance: 'first',
        tooltip: 'Dieses Feld gibt den effektiven Jahreszins an. Dieser entspricht der Effektivverzinsung bzw. dem internen Zinsfuß (internal rate of return) normalisiert auf ein Jahr.'
      }
    ]
  });


  mortgage.save(function (err) {
    if (err) {
      console.log(err);
      console.log('Seed Failed for Calc.Elem.Model.Mortgage');
      return next(err);
    } else {
      console.log('Calc.Elem.Model.Mortgage successfully seeded');
    }
  });



  /**
   * SEED DEPOSITS-OVERNIGHT
   * */
  var overnight = new Calc({
    name: 'overnight',
    id: 'deposits-overnight',
    designation: 'Tagesgeldrechner',
    description: 'Der Tagesgeldrechner eignet sich zur Berechnung von Zinsertrag, Anfangskapital, Zinssatz und die Zinstage für eine tageweise Geldanlage.',
    inputs: [
      {
        name: 'calcselect',
        id: 'deposits-overnight-calcselect',
        label: 'Was soll berechnet werden?',
        tooltip: 'Wählen Sie hier aus, ob der Zinsertrag, das Anfangskapital, der Zinssatz oder die Laufzeit in Zinstagen berechnet werden sollen. Der Rechner wird das Eingabefeld für die zu berechnende Größe dann ausblenden und genau diese Größe berechnen.',
        type: 'select',
        vtype: 'number',
        args: [1, 4],
        options: [
          {
            id: '1',
            description: 'Zinsertrag'
          },
          {
            id: '2',
            description: 'Anfangskapital'
          },
          {
            id: '3',
            description: 'Zinssatz'
          },
          {
            id: '4',
            description: 'Laufzeit'
          }
        ]
      },
      {
        name: 'principal',
        id: 'deposits-overnight-principal',
        label: 'Anfangskapital',
        addon: 'EUR',
        linetop: true,
        placeholder: 'Anfangskapital',
        value: '8000.00',
        tooltip: 'Das Anfangskapital ist der anfängliche Anlagebetrag der Tagesgeldanlage. Wenn man also 1.000 EUR bei der Bank als Tagesgeld zur Anlage bringt, so entspricht dies dem Anfangskapital.',
        type: 'number',
        vtype: 'number',
        args: [0, 1000000000]
      },
      {
        name: 'interesttype',
        id: 'deposits-overnight-interesttype',
        linetop: false,
        label: 'Guthabenabhängige Verzinsung?',
        tooltip: 'Wählen Sie hier "JA", falls die Verzinsung abhängig vom Guthaben ist (Zinsstaffel). Sie können dann guthabenabhängige Zinssätze eingeben. Wenn Sie "NEIN" wählen, geben Sie bitte einen Zinsatz im folgenden Feld an, welcher dann unabhängig vom Guthaben angewendet wird.',
        type: 'select',
        vtype: 'bool',
        options: [
          {
            id: 'false',
            description: 'NEIN'
          },
          {
            id: 'true',
            description: 'JA'
          }
        ]
      },
      {
        name: 'specialinterestpositions',
        id: 'deposits-overnight-specialinterestpositions',
        linetop: false,
        hide: true,
        secondary: 'true',
        label: 'Wie viele Guthabenstaffeln gibt es?',
        tooltip: 'Geben Sie die Anzahl der Guthabenstaffeln ein. Dieser Wert entspricht der Anzahl der zutreffenden Kombinationen aus Guthabensgrenzen und Zinssätzen.',
        type: 'select',
        vtype: 'number',
        optional: true,
        args: [0, 10],
        options: [
          {
            id: '0',
            description: '0'
          },
          {
            id: '1',
            description: '1'
          },
          {
            id: '2',
            description: '2'
          },
          {
            id: '3',
            description: '3'
          },
          {
            id: '4',
            description: '4'
          },
          {
            id: '5',
            description: '5'
          },
          {
            id: '6',
            description: '6'
          },
          {
            id: '7',
            description: '7'
          },
          {
            id: '8',
            description: '8'
          }, {
            id: '9',
            description: '9'
          },
          {
            id: '10',
            description: '10'
          }
        ]
      },
      {
        name: 'specialinterestthreshold',
        id: 'deposits-overnight-specialinterestthreshold',
        type: 'custom',
        vtype: 'number',
        args: [0, 1000000000],
        label: 'Guthaben ab',
        optional: 'false',
        array: 'true',
        arrayParent: 'specialinterestpositions'
      },
      {
        name: 'specialinterest',
        id: 'deposits-overnight-specialinterest',
        type: 'custom',
        vtype: 'number',
        args: [0, 100],
        label: 'Zinssatz in % p. a.',
        optional: 'false',
        array: 'true',
        arrayParent: 'specialinterestpositions'
      },
      {
        name: 'interest',
        id: 'deposits-overnight-interest',
        label: 'Zinssatz',
        addon: '% p. a.',
        placeholder: 'Zinssatz',
        value: '3.50',
        tooltip: 'Geben Sie den jährlichen nominalen Zinssatz ein, mit welchem das Kapital verzinst wird.',
        type: 'number',
        vtype: 'number',
        args: [0, 100]
      },
      {
        name: 'interestperiod',
        id: 'deposits-overnight-interestperiod',
        linetop: false,
        hide: false,
        secondary: false,
        label: 'Zinsperiode',
        tooltip: 'Die Zinsperiode entspricht dem Zeitraum zwischen zwei Zinsgutschrift-Terminen und bestimmt somit die Häufigkeit der Zinsgutschriften. Nach Gutschrift werden die Zinsen dem Kapital zugeschlagen und fortan mitverzinst. Wählen Sie die Einstellung "Auszahlung", falls die Zinserträge nur einmal am Ende der Anlagedauer gutgeschrieben oder ausgezahlt werden.',
        type: 'select',
        vtype: 'number',
        optional: true,
        args: [0, 5],
        options: [
          {
            id: '0',
            description: 'Auszahlung / kein Zinseszins'
          },
          {
            id: '1',
            description: 'täglich'
          },
          {
            id: '2',
            description: 'monatlich'
          },
          {
            id: '3',
            description: 'vierteljährlich'
          },
          {
            id: '4',
            description: 'halbjährlich'
          },
          {
            id: '5',
            description: 'jährlich'
          }
        ]
      },
      {
        name: 'periodselect',
        id: 'deposits-overnight-periodselect',
        linetop: false,
        label: 'Zeitraum als Datum oder Zinstage vorgeben?',
        tooltip: 'Wählen Sie hier "Datum", falls Sie den Anlagezeitraum als Datumsbereich vorgeben wollen. Die Zinstage werden dann automatisch nach der gewählten Zinsmethode berechnet. Alternativ können Sie "Zinstage" wählen und die Anlagedauer entsprechend in Zinstagen eingeben.',
        type: 'select',
        vtype: 'bool',
        options: [
          {
            id: 'false',
            description: 'Zinstage'
          },
          {
            id: 'true',
            description: 'Datum'
          }
        ]
      },
      {
        name: 'begindate',
        id: 'deposits-overnight-begindate',
        linetop: false,
        option: false,
        hide: true,
        secondary: true,
        label: 'Anfagsdatum',
        addon: 'Datum',
        value: '08.01.2015',
        tooltip: 'Geben Sie hier den ersten Tag des Anlagezeitraums an. Dieser Tag wird, wie üblich, in der Berechnung nicht mitgezählt.',
        type: 'date',
        vtype: 'date'
      },
      {
        name: 'enddate',
        id: 'deposits-overnight-enddate',
        linetop: false,
        option: false,
        hide: true,
        secondary: true,
        label: 'Enddatum',
        addon: 'Datum',
        value: '28.04.2015',
        tooltip: 'Geben Sie hier den letzten Tag des Anlagezeitraums an. Dieser Tag wird in der Berechnung mitgezählt.',
        type: 'date',
        vtype: 'date'
      },
      {
        name: 'interestdays',
        id: 'deposits-overnight-interestdays',
        linetop: false,
        label: 'Laufzeit / Zinstage',
        placeholder: 'Laufzeit / Zinstage',
        addon: 'Tage',
        value: '100',
        optional: false,
        hide: false,
        secondary: true,
        tooltip: 'Die Dauer der Anlage in Tagen nach der gewählten Zinsmethode.',
        type: 'number',
        vtype: 'number',
        args: [0, 10000]
      },
      {
        name: 'interestgain',
        id: 'deposits-overnight-interestgain',
        linetop: false,
        optional: false,
        disabled: true,
        label: 'Zinsertrag (nach Steuern)',
        value: '',
        placeholder: 'Zinsertrag',
        addon: 'EUR',
        tooltip: 'Geben Sie den Zinsertrag an, welchen die Anlage erzielt. Falls Steuern berücksichtigt werden, geben Sie bitte den Zinsertrag nach Abzug der Steuern an.',
        type: 'number',
        vtype: 'number',
        args: [0.000001, 100000000]
      },
      {
        name: 'daycount',
        id: 'deposits-overnight-daycount',
        linetop: false,
        label: 'Zinsmethode',
        tooltip: 'Anzuwendendes Verfahren zur Berechnung der Zins- und Basistage.',
        type: 'select',
        vtype: 'string',
        options: [
          {
            id: 'a30E360',
            description: '30E / 360 ISDA, Deutsche Zinsmethode'
          },
          {
            id: 'a30360',
            description: '30E / 360, ISDA Anleihenbasis',
          },
          {
            id: 'act360',
            description: 'act / 360',
          },
          {
            id: 'act365',
            description: 'act / 365',
          },
          {
            id: 'actact',
            description: 'act / act, Taggenaue Methode'
          }
        ]
      },
      {
        name: 'taxes',
        id: 'deposits-overnight-taxes',
        linetop: true,
        label: 'Steuern berücksichtigen?',
        tooltip: 'Wählen Sie "JA", um Steuerabzüge auf Kapitalerträge bei der Berechnung zu berücksichtigen.',
        type: 'select',
        vtype: 'bool',
        options: [
          {
            id: 'false',
            description: 'NEIN'
          },
          {
            id: 'true',
            description: 'JA'
          }
        ]
      },
      {
        name: 'taxrate',
        id: 'deposits-overnight-taxrate',
        linetop: false,
        optional: false,
        secondary: true,
        hide: 'true',
        label: 'Steuersatz',
        placeholder: 'Steuersatz',
        addon: '% p. a.',
        value: '26.375',
        tooltip: 'Geben Sie den prozentualen Steuersatz an, mit welchem die Kapitalerträge nach Abzug des Freibetrages belastet werden.',
        type: 'number',
        vtype: 'number',
        args: [0, 75]
      },
      {
        name: 'taxfree',
        id: 'deposits-overnight-taxfree',
        linetop: false,
        optional: false,
        secondary: true,
        hide: 'true',
        label: 'Jährlicher Freibetrag',
        placeholder: 'Freibetrag',
        addon: 'EUR',
        value: '801.00',
        tooltip: 'Geben Sie den jährlichen Steuerfreibetrag an. In Deutschland beträgt der Freibetrag 801.00 EUR für Ledige und 1.602.00 EUR für Verheiratete.',
        type: 'number',
        vtype: 'number',
        args: [0, 100000]
      }
    ],
    results_1: [
      {
        name: 'interestdays',
        description: 'Zinstage',
        unit: 'Tage',
        digits: 0,
        importance: 'second',
        tooltip: 'Die Anlagedauer in Zinstagen nach der gewählten Zinsmethode.'
      },
      {
        name: 'interestdaysfirst',
        description: 'Zinstage',
        unit: 'Tage',
        digits: 0,
        importance: 'first',
        tooltip: 'Die Anlagedauer in Zinstagen nach der gewählten Zinsmethode.'
      },
      {
        name: 'interestfactor',
        tooltip: 'Der aus den Zinstagen errechnete Faktor, mit welchem der Zinssatz multipliziert wird, um das Endkapital zu berechnen.',
        omittooltip: false,
        description: 'Zinsfaktor',
        unit: '',
        digits: 4,
        importance: 'second'
      },
      {
        name: 'interestgain',
        tooltip: 'Der akkumulierte Zinsertrag der Tagesgeldanlage.',
        description: 'Zinsertrag',
        unit: 'EUR',
        digits: 2,
        importance: 'first'
      },
      {
        name: 'interestgainaftertax',
        tooltip: 'Der akkumulierte Zinsertrag der Tagesgeldanlage nach Steuern.',
        description: 'Zinsertrag nach Steuern',
        unit: 'EUR',
        digits: 2,
        importance: 'first'
      },
      {
        name: 'interestgainbeforetax',
        tooltip: 'Der akkumulierte Zinsertrag der Tagesgeldanlage vor Abzug von Steuern.',
        description: 'Zinsertrag vor Steuern',
        unit: 'EUR',
        digits: 2,
        importance: 'second'
      },
      {
        name: 'taxes',
        tooltip: 'Die sich aus den eingegebenen Steuerparametern (Steuersatz, jährlicher Freibetrag) ergebende Steuerlast.',
        description: 'Steuerlast',
        unit: 'EUR',
        digits: 2,
        importance: 'second'
      },
      {
        name: 'terminal',
        tooltip: 'Das Endkapital ergibt sich aus dem Anfangskapital zusammen mit dem Zinsertrag',
        description: 'Endkapital',
        unit: 'EUR',
        digits: 2,
        importance: 'first'
      },
      {
        name: 'principal',
        tooltip: 'Das zur Erzielung des angegebenen Zinsertrags erforderliche Anfangskapital',
        description: 'Anfangskapital',
        unit: 'EUR',
        digits: 2,
        importance: 'first'
      },
      {
        name: 'averageinterest',
        tooltip: 'Der Zinssatz, welcher bei guthabenunabhäniger Verzinsung das gleiche Endkapital wie die eingegebenem Staffelzinsen ergeben würde.',
        description: 'Durchschnittlicher Zinssatz',
        unit: '% p. a.',
        digits: 3,
        importance: 'second'
      },
      {
        name: 'interest',
        tooltip: 'Der jährliche Nominalzins, welcher für die Erzielung des eingegebenen Zinsertrags notwendig ist.',
        description: 'Zinssatz',
        unit: '% p. a.',
        digits: 3,
        importance: 'first'
      }
    ]
  });



  overnight.save(function (err) {
    if (err) {
      console.log(err);
      console.log('Seed Failed for Calc.Elem.Model.Overnight');
      return next(err);
    } else {
      console.log('Calc.Elem.Model.Overnight successfully seeded');
    }
  });




  /**
   * SEED BOERSE-PORTFOLIO
   * */
  var portfolio = new Calc({
    name: 'portfolio',
    id: 'boerse-portfolio',
    designation: 'Portfoliorechner',
    description: 'Mit dem Portfoliorechner können Sie das effiziente Aktienportfolio nach der modernen Portfoliotheorie des Nobelpreisträgers Harry Markowitz bestimmen. Der Portfoliorechner kann zum Beispiel genutzt werden, um festzustellen, ob ihr Portfolio effizient ist oder umgeschichtet werden sollte.',
    inputs: [
      {
        name: 'return',
        id: 'boerse-portfolio-return',
        label: 'Zielrendite',
        addon: '% p. a.',
        placeholder: 'Zielrendite',
        value: '15.50',
        tooltip: 'TBD',
        type: 'number',
        vtype: 'number',
        args: [0, 100]
      },
      {
        name: 'frequency',
        id: 'boerse-portfolio-frequency',
        label: 'Returnfrequenz',
        tooltip: 'TBD',
        type: 'select',
        vtype: 'number',
        args: [0, 3],
        options: [
          {
            id: '0',
            description: 'wöchentlich'
          },
          {
            id: '1',
            description: 'monatlich'
          },
          {
            id: '2',
            description: 'vierteljährlich'
          },
          {
            id: '3',
            description: 'jährlich'
          }
        ]
      },
      {
        name: 'asset',
        id: 'boerse-portfolio-asset',
        label: 'Position',
        tooltip: 'TBD',
        type: 'custom',
        vtype: 'string',
        options: qMeta.fse
      }
    ],
    results_1: [
      {
        name: 'test',
        description: 'Zinstage',
        unit: 'Tage',
        digits: 0,
        importance: 'second',
        tooltip: 'Die Anlagedauer in Zinstagen nach der gewählten Zinsmethode.'
      },
      {
        name: 'expectedreturn',
        description: 'Mittlere erwartete Rendite',
        unit: '% p. a.',
        digits: 3,
        importance: 'second',
        tooltip: 'Die erwartete Rendite der Aktie, berechnet aus dem Mittelwert der historischen Renditen.'
      },
      {
        name: 'stdev',
        description: 'Standardabweichung',
        unit: '% p. a.',
        digits: 3,
        importance: 'second',
        tooltip: 'Die Standardabweichung der Aktie, welche ein Risikomaß darstellt.'
      },
      {
        name: 'stock',
        description: '',
        unit: '',
        digits: 0,
        importance: 'first',
        tooltip: 'TBD',
        type: 'string',
        omittooltip: true
      },
      {
        name: 'portfolioreturn',
        description: 'Erwartete Portfoliorendite',
        unit: '% p. a.',
        digits: 2,
        importance: 'first',
        tooltip: 'TBD'
      },
      {
        name: 'portfoliorisk',
        description: 'Erwartetes Portfoliorisiko (Standardabweichung)',
        unit: '% p. a.',
        digits: 2,
        importance: 'first',
        tooltip: 'TBD'
      },
      {
        name: 'portfolioweight',
        description: 'Portfoliogewicht',
        unit: '%',
        digits: 1,
        importance: 'second',
        tooltip: 'TBD'
      },
      {
        name: 'portfolioweightintro',
        description: 'Portfoliogewichte der Einzelaktien',
        unit: '',
        digits: 1,
        importance: 'first',
        tooltip: 'TBD',
        type: 'string'
      }
    ]
  });



  portfolio.save(function (err) {
    if (err) {
      console.log(err);
      console.log('Seed Failed for Calc.Elem.Model.Portfolio');
      return next(err);
    } else {
      console.log('Calc.Elem.Model.Portfolio successfully seeded');
    }
  });





}  /** /function seeder */