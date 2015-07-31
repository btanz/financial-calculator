

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
        return
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
      }
    ]
    
    
  });

  equityreturn.save(function (err) {
    if (err) {
      console.log(err);
      console.log('Seed Failed for Calc.Elem.Model.FX');
      return next(err);
    } else {
      console.log('Calc.Elem.Model.FX successfully seeded');
    }
  });


}