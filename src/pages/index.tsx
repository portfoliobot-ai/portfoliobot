import Head from 'next/head'
import Image from 'next/image'

import styles from '@/styles/Home.module.css'

import "primereact/resources/themes/viva-dark/theme.css";     
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css"; 
import "primeflex/primeflex.css"

import { Button } from 'primereact/button';
import { Steps } from 'primereact/steps';
import { useState } from 'react';
import { MenuItem, MenuItemCommandEvent } from 'primereact/menuitem';
import { Card } from 'primereact/card';
import { SelectButton } from 'primereact/selectbutton';
import { Fieldset } from 'primereact/fieldset';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { AutoComplete } from 'primereact/autocomplete';
import { Accordion, AccordionTab } from 'primereact/accordion';

import { InputNumber } from 'primereact/inputnumber';
        
import Typewriter from 'typewriter-effect';

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);
    // const toast = useRef(null);
  const items: MenuItem[] = [
    {
        label: 'Portfolio',
        command: (event: MenuItemCommandEvent) => {
            // toast.current.show({ severity: 'info', summary: 'Third Step', detail: event.item.label });
        }
    },
    {
        label: 'Investor Info',
        command: (event: MenuItemCommandEvent) => {
            // toast.current.show({ severity: 'info', summary: 'First Step', detail: event.item.label });
        }
    },
    {
      label: 'Breakdown',
      command: (event: MenuItemCommandEvent) => {
          // toast.current.show({ severity: 'info', summary: 'Third Step', detail: event.item.label });
      }
    },
    {
        label: 'AI Feedback',
        command: (event: MenuItemCommandEvent) => {
            // toast.current.show({ severity: 'info', summary: 'Last Step', detail: event.item.label });
        }
    }
  ]

  const [investorInfo, setInvestorInfo] = useState(null)
  const [portfolioHoldings, setPortfolioHoldings] = useState([])
  const [chatGptFeedback, setChatGptFeedback] = useState({})

  const portfolioOptions = ['Manual', 'Import'];
  const [selectedPortfolioOption, setSelectedPortfolioOption] = useState(portfolioOptions[0]);

  const [selectedRiskTolerance, setSelectedRiskTolerance] = useState();
  const riskTolerances = [
      { name: 'Conservative', code: 'Conservative' },
      { name: 'Moderate', code: 'Moderate' },
      { name: 'Aggresive', code: 'Aggresive' },
  ];

  const [selectedStocks, setSelectedStocks] = useState([]);
  const [filteredStocks, setFilteredStocks] = useState([]);

  const searchStocks = (event: any) => {
    fetch(`/api/iexcloud/search/${event.query}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        //  setPortfolioHoldings(data);
        setFilteredStocks(data)
      })
      .catch((err) => {
          console.log(err.message);
      });
      // setItems([...Array(10).keys()].map(item => event.query + '-' + item));
  }

  const stockSearchTemplate = (stock: any) => {
    return (
      <div style={{display: "flex", alignItems: "center" }}>
        {/* <Image
          className='stock-logo mr-2'
          // TODO: Need alt
          alt='Image of company logo'
          src={`https://storage.googleapis.com/iex/api/logos/${stock.symbol}.png`}
          // onerror="this.onerror=null; this.src=''"
          // onError={() => setSrc('/assets/ima ge-error.png')}
          // style={{width: "24px", height: "auto"}}
          width={24}
          height={24}
        /> */}
        <small>
          <b>{stock.symbol}</b>
        </small>
        <span className='m-2'>|</span>
        <small>
          { stock.securityName }
        </small>
      </div>
    )
  }

  const onClickNext = () => {
    setActiveIndex(activeIndex + 1)

    switch (activeIndex) {
      case 0:
        setInvestorInfo(null);
        break;
      case 1:
        break;
      case 2:
        break;
      case 3:
        // fetch('api/')
        // .then((response) => response.json())
        // .then((data) => {
        //    console.log(data);
        //   //  setPortfolioHoldings(data);
        // })
        // .catch((err) => {
        //     console.log(err.message);
        // });
        break;
    }
  }

  return (
    <>
      <Head>
        <title>PortfolioBot - AI-Driven Feedback for your Investment Portfolio</title>
        {/* TODO: Add description */}
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.navbar}>
        <h1>PortfolioBot</h1>
      </div>

      <main className={styles.main}>

        <div className={styles.description}>

          {/* HEADER SECTION */}
          <div className='mb-5'>
            <h1>Are your investments
              <Typewriter
                options={{
                  strings: ['<span> diversified?</span>', '<span> cost-effective?</span>'],
                  autoStart: true,
                  loop: true,
                  wrapperClassName: 'emphasized'
                }}
              />
            </h1>
            <br></br>
            <p className='homepage-secondary-header'>
              Get <span className='emphasized'>AI-driven</span> feedback on your stock portfolio in minutes
            </p>
          </div>

          {/* STEPS */}
          <div className='mb-3'>
            <Steps
              model={items}
              activeIndex={activeIndex}
              onSelect={(e) => setActiveIndex(e.index)}
              readOnly={false}
            />
          </div>

          {/* FIRST STEP */}
          <div className={ activeIndex === 0 ? undefined : 'hidden'}>
            {/* <Fieldset legend="Enter your portfolio allocations"> */}
            <Card>
              <SelectButton value={selectedPortfolioOption} onChange={(e) => setSelectedPortfolioOption(e.value)} options={portfolioOptions} />
              {/* <InputText placeholder="Holdings" /> */}
              <br></br>

              {
                selectedPortfolioOption === "Manual" && (
                  <div>
                    <div className='mb-2 p-inputgroup'>
                    {/* <div className="flex flex-column gap-2"> */}
                      {/* <i className="pi pi-search" /> */}
                      {/* <label htmlFor="stockSearch">Search</label> */}
                      <AutoComplete
                        inputId="stockSearch"
                        value={selectedStocks}
                        suggestions={filteredStocks} 
                        completeMethod={searchStocks}
                        multiple
                        // onChange={(e) => setSelectedCountry(e.value)}
                        itemTemplate={stockSearchTemplate}
                        placeholder="Search for stocks e.g. AAPL or Apple"
                      />
                      {/* <small id="stockSearch-help">
                          Test
                      </small> */}
                    {/* </div> */}
                    </div>

                    {/* <br></br> */}
      
                    <DataTable value={[]} showGridlines>
                      <Column field="stock" header="Stock"></Column>
                      <Column field="allocation" header="Allocation"></Column>
                    </DataTable>
                  </div>
                )
              }
              {
                selectedPortfolioOption === "Import" && (
                  <div>
                    <h2>Coming Soon!</h2>
                  </div>
                )
              }
            </Card>
            {/* </Fieldset> */}
          </div>

          {/* SECOND STEP */}
          <div className={ activeIndex === 1 ? 'step' : 'hidden'}>
            {/* <Fieldset legend="Investor Info"> */}
            <Card>
              <div className="p-inputgroup">
                  <InputNumber placeholder="Your Age" />
              </div>
              <div className="p-inputgroup">
                  <InputNumber placeholder="Target Retirement Age" />
              </div>
              <div className="p-inputgroup">
                <Dropdown value={selectedRiskTolerance} onChange={(e) => setSelectedRiskTolerance(e.value)} options={riskTolerances} optionLabel="name" 
                  placeholder="Risk Tolerance" className="w-full md:w-14rem" />
              </div>
            </Card>
            {/* </Fieldset> */}
          </div>

          {/* THIRD STEP */}
          <div className={ activeIndex === 2 ? undefined : 'hidden'}>
              <Card>
                Test
              </Card>
          </div>

          <br></br>

          {/* FINAL STEP */}
          <div className={ activeIndex === 3 ? undefined : 'hidden'}>
            <Accordion multiple activeIndex={[0,1]}>
                <AccordionTab header="Is my portfolio diversified enough?">
                    <small className="m-0">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                        Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </small>
                </AccordionTab>
                <AccordionTab header="What other stocks/ETFS should I invest in?">
                    <small className="m-0">
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa 
                        quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas 
                        sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. 
                        Consectetur, adipisci velit, sed quia non numquam eius modi.
                    </small>
                </AccordionTab>
            </Accordion>
            {/* <Fieldset legend="Summary" toggleable>
              <p className="m-0">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                  consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </Fieldset>

            <br></br>

            <Fieldset legend="Is my portfolio diversified enough?" toggleable>
              <p className="m-0">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                  consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </Fieldset>

            <br></br>

            <Fieldset legend="What other stocks/ETFS should I invest in?" toggleable>
              <p className="m-0">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                  consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
            </Fieldset> */}
          </div>

          <br></br>

          {/* BUTTONS */}
          <div className='button-panel'>
            {
              activeIndex > 0 && (
                <Button label="Back" onClick={() => setActiveIndex(activeIndex - 1)} />
              )
            }
            &nbsp;
            {
              activeIndex < items.length - 1 && (
                <Button
                  label={ activeIndex === 0 ? 'Get Started' : 'Next' }
                  onClick={() => setActiveIndex(activeIndex + 1)}
                />
              )
            }
          </div>

        </div>
      </main>
    </>
  )
}
