import { Badge, DataList } from '@radix-ui/themes';
import { Reactlit, useReactlitState } from '@reactlit/core';
import { configureInputs } from '@reactlit/radix';
import { Main } from '../../components/main';

const Inputs = configureInputs();

interface Country {
  name: string;
  region: string;
  subregion: string;
  population: number;
  code: string;
}

export async function fetchCountries(): Promise<Country[]> {
  const results = await fetch(
    'https://restcountries.com/v3.1/all?fields=name,region,subregion,population,cca3',
    {
      cache: 'force-cache',
      next: {
        revalidate: 300,
        tags: ['countries'],
      },
    }
  );
  const rawResults = await results.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return rawResults.map((r: any) => ({
    name: r.name.common,
    region: r.region,
    subregion: r.subregion,
    population: r.population,
    code: r.cca3,
  }));
}

export default function RadixInputs() {
  const [appState, setAppState] = useReactlitState({
    countrySearch: '',
    country: undefined as Country | undefined,
    form: {
      name: '',
      bio: '',
      number: [],
      letter: undefined as string | undefined,
      color: 'red',
      slider: 0,
      rangeSlider: [20, 80],
    },
  });
  return (
    <Main>
      <Reactlit state={appState} setState={setAppState}>
        {async ({ display, view }) => {
          display(<div className="text-2xl">Inputs test</div>);
          const results = view(
            'form',
            Inputs.Form({
              name: Inputs.Text({
                label: 'Name',
                placeholder: 'Enter your name',
              }),
              bio: Inputs.TextArea({
                label: 'Bio',
                placeholder: 'Enter your bio',
              }),
              number: Inputs.Check(
                { one: '1', two: '2', three: '3' },
                {
                  label: 'Pick any numbers',
                }
              ),
              letter: Inputs.Radio(['A', 'B', 'C'], {
                label: 'Pick one Letter',
              }),
              color: Inputs.Select(['red', 'blue', 'green'] as const, {
                label: 'Pick a color',
              }),
              slider: Inputs.Slider({
                label: 'Slider',
                min: 0,
                max: 100,
              }),
              rangeSlider: Inputs.RangeSlider({
                label: 'Range Slider',
                min: 0,
                max: 100,
              }),
            })
          );

          const countries = await fetchCountries();
          display(<div className="even:bg-gray-50">Select a country</div>);
          const filteredCountries = view(
            'countrySearch',
            Inputs.Search(countries, {
              label: 'Search',
              placeholder: 'Search countries...',
            })
          );
          const selectedCountry = view(
            'country',
            Inputs.Table(filteredCountries, {
              getRowId: (country) => country.code,
              label: 'Countries',
            })
          );

          const { name, bio, number, letter, color, slider, rangeSlider } =
            results;
          display(
            <>
              <div className="text-2xl mt-4 py-2">Results</div>
              <DataList.Root>
                <DataList.Item>
                  <DataList.Label>Name</DataList.Label>
                  <DataList.Value>{name}</DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label>Bio</DataList.Label>
                  <DataList.Value>
                    <div className="whitespace-pre">{bio}</div>
                  </DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label>Numbers</DataList.Label>
                  <DataList.Value>{number.join(', ')}</DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label>Letter</DataList.Label>
                  <DataList.Value>{letter}</DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label>Color</DataList.Label>
                  <DataList.Value>
                    <Badge color={color}>{color}</Badge>
                  </DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label>Slider</DataList.Label>
                  <DataList.Value>{slider}</DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label>Range Slider</DataList.Label>
                  <DataList.Value>{rangeSlider.join(' - ')}</DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label>Country</DataList.Label>
                  <DataList.Value>{selectedCountry?.name}</DataList.Value>
                </DataList.Item>
              </DataList.Root>
            </>
          );
        }}
      </Reactlit>
    </Main>
  );
}
