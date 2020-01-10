import React, {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, Image} from 'react-native';
import {Searchbar, List, TouchableRipple, Button} from 'react-native-paper';
import {SafeAreaView} from 'react-navigation';
import {Images} from '../../themes';
import Loading from '../../components/Loading';
import {BookActions, BookSelectors} from '../../redux/ducks/BookRedux';
import * as S from './styles';

const Search = () => {
  const dispatch = useDispatch();
  const loading = useSelector(BookSelectors.selectLoading);
  const books = useSelector(BookSelectors.selectBooks);
  const [search, setSearch] = useState('');
  const searchTimeout = useRef(null);

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      dispatch(BookActions.books(0, search));
    }, 2000);
  }, [search]);

  const nextPage = () => {
    dispatch(BookActions.books(books.length, search));
  };

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 1;
  };

  return (
    <SafeAreaView forceInset={{bottom: 'never'}}>
      <View style={{maxHeight: '100%'}}>
        <Searchbar
          placeholder="Pesquise os Livros"
          onChangeText={setSearch}
          value={search}
          style={{margin: 5}}
        />
        <List.Section>
          <List.Subheader>Filtrar por ano de publicação</List.Subheader>
        </List.Section>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
            marginBottom: 20,
          }}>
          <Button
            icon="calendar"
            mode="outline"
            onPress={() => console.log('Pressed')}>
            Ano Inicial
          </Button>
          <Button
            icon="calendar"
            mode="outline"
            onPress={() => console.log('Pressed')}>
            Ano Final
          </Button>
        </View>

        <S.ListSectionWrapper
          onScroll={({nativeEvent}) => {
            if (isCloseToBottom(nativeEvent) && !loading) {
              nextPage();
            }
          }}>
          <List.Section>
            <List.Subheader>Some title</List.Subheader>
            {books.map((b, index) => {
              return (
                <TouchableRipple
                  key={b.id}
                  onPress={() => console.log('Pressed')}
                  rippleColor="rgba(0, 0, 0, .32)">
                  <List.Item
                    title={`${b.volumeInfo.title}`}
                    description={`Carl Sagan\nAno de Publicação: ${
                      b.volumeInfo.publishedDate
                        ? b.volumeInfo.publishedDate.split('-')[0]
                        : 'Não definido'
                    }\nISBN: 9982747729797913737`}
                    left={() => (
                      <S.BookWrapper>
                        <S.Book source={Images.book_cover_sample} />
                      </S.BookWrapper>
                    )}
                  />
                </TouchableRipple>
              );
            })}
          </List.Section>
        </S.ListSectionWrapper>
        {loading && <Loading />}
      </View>
    </SafeAreaView>
  );
};

Search.navigationOptions = {
  title: 'Livros',
};

export default Search;
