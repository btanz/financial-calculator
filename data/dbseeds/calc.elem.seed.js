

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
            descriptions: 'Euro - EUR'
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
            descriptions: 'Bahrain-Dinar - BHD'
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
            descriptions: 'Euro - EUR'
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
            descriptions: 'Bahrain-Dinar - BHD'
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

}