import { useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Feather } from '@expo/vector-icons';

import { BackButton } from "../components/BackButton";
import { Checkbox } from "../components/Checkbox";
import colors from "tailwindcss/colors";
import { api } from "../lib/axios";

const availableWeekDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-Feira', 'Sábado'];

export function New() {
    const [weekDays, setWeekDays] = useState<number[]>([]);
    const [title, setTitle] = useState<string>();

    function handleToggleWeekDay(weekDayIndex: number) {
        if(weekDays.includes(weekDayIndex)) {
            setWeekDays(prevState => prevState.filter(weekDay => weekDay !== weekDayIndex));
        } else {
            setWeekDays(prevState => [...prevState, weekDayIndex]);
        };
    };

    async function handleCreateNewHabit() {
        try {
            if(!title?.trim() || weekDays.length === 0) {
                return Alert.alert('Novo Hábito', 'Informe o nome do hábito e selecione pelo menos um dia.')
            }

            await api.post('/habits', { title, weekDays })
            setTitle('');
            setWeekDays([]);

            Alert.alert('Novo hábito', 'Hábito criado com sucesso!');
        } catch (error) {
            console.log(error);
            Alert.alert('Ops', 'Não foi possível criar um novo hábito!')
        }
        
    }

    return (
        <View className="flex-1 bg-background px-8 pt-18" >
            <ScrollView
                showsVerticalScrollIndicator={ false }
                contentContainerStyle={{ paddingBottom: 100, paddingTop: 100 }}
            >
                <BackButton />

                <Text className="mt-6 text-white font-extrabold text-3xl">
                    Criar hábito
                </Text>

                <Text className="mt-6 text-white font-semibold text-base">
                    Qual seu comprometimento?
                </Text>

                <TextInput
                  className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600"
                  placeholder="ex.: Exercícios, dormir bem, etc..."
                  placeholderTextColor={colors.zinc["400"]}
                  onChangeText={ setTitle }
                  value={ title }
                />

                <Text className="font-semibold mt-4 mb-3 text-white text-base">
                    Qual a recorrência?
                </Text>

                {
                    availableWeekDays.map((weekDay, index) => (
                        <Checkbox
                            key={ index }
                            title={ weekDay }
                            checked={ weekDays.includes(index) }
                            onPress={ () => handleToggleWeekDay(index) }
                        />

                    ))
                }
                <TouchableOpacity
                  className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6"
                  onPress={handleCreateNewHabit}
                >
                    <Feather
                      name="check"
                      size={20}
                      color={ colors.white }
                    />
                    <Text className="font-semibold text-base text-white ml-2">
                        Confirmar
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
};
