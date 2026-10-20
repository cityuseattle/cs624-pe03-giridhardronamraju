
import { useState } from 'react';
import {
  Alert,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

type Filter = 'All' | 'Completed' | 'Incomplete';

export default function HomeScreen() {
  const [taskInput, setTaskInput] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [activeFilter, setActiveFilter] = useState<Filter>('All');
  const [nextId, setNextId] = useState(1);

  const addTodo = () => {
    const title = taskInput.trim();

    if (!title) {
      if (Platform.OS === 'web') {
        console.warn('Enter a task before submitting.');
      } else {
        Alert.alert('Task required', 'Please enter a task first.');
      }
      return;
    }

    const newTodo: Todo = {
      id: nextId,
      title,
      completed: false,
    };

    const updatedTodos = [...todos, newTodo];

    setTodos(updatedTodos);
    setTaskInput('');
    setNextId((currentId) => currentId + 1);
    Keyboard.dismiss();

    console.log('New task submitted:', newTodo);
    console.log('Updated todo array:', updatedTodos);
  };

  const toggleTodo = (id: number) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );

    setTodos(updatedTodos);
    console.log('Todo status updated:', updatedTodos);
  };

  const deleteTodo = (id: number) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);

    setTodos(updatedTodos);
    console.log('Todo deleted. Updated todo array:', updatedTodos);
  };

  const changeFilter = (filter: Filter) => {
    setActiveFilter(filter);

    const filtered = todos.filter((todo) => {
      if (filter === 'Completed') return todo.completed;
      if (filter === 'Incomplete') return !todo.completed;
      return true;
    });

    console.log(`Selected filter: ${filter}`);
    console.log('Filtered todo array:', filtered);
  };

  const filteredTodos = todos.filter((todo) => {
    if (activeFilter === 'Completed') return todo.completed;
    if (activeFilter === 'Incomplete') return !todo.completed;
    return true;
  });

  const completedCount = todos.filter((todo) => todo.completed).length;
  const remainingCount = todos.length - completedCount;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FC" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.eyebrow}>MY PRODUCTIVITY</Text>
            <Text style={styles.title}>My Todos</Text>
            <Text style={styles.subtitle}>
              Small steps make big progress.
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Text style={styles.headerIconText}>✓</Text>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.totalNumber}>{todos.length}</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryItem}>
            <Text style={styles.completedNumber}>{completedCount}</Text>
            <Text style={styles.summaryLabel}>Completed</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryItem}>
            <Text style={styles.remainingNumber}>{remainingCount}</Text>
            <Text style={styles.summaryLabel}>Remaining</Text>
          </View>
        </View>

        <View style={styles.addSection}>
          <Text style={styles.sectionTitle}>Add a new task</Text>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={taskInput}
              onChangeText={setTaskInput}
              placeholder="What needs to get done?"
              placeholderTextColor="#929AAF"
              returnKeyType="done"
              onSubmitEditing={addTodo}
              accessibilityLabel="Enter a new todo task"
            />

            <Pressable
              onPress={addTodo}
              style={({ pressed }) => [
                styles.addButton,
                pressed && styles.pressedButton,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Add task"
            >
              <Text style={styles.addButtonText}>+</Text>
            </Pressable>
          </View>

          <Text style={styles.helperText}>
            Enter a task and press + to add it to your list.
          </Text>
        </View>

        <View style={styles.tasksHeader}>
          <Text style={styles.sectionTitle}>Your tasks</Text>
          <Text style={styles.taskCount}>
            {filteredTodos.length}{' '}
            {filteredTodos.length === 1 ? 'task' : 'tasks'}
          </Text>
        </View>

        <View style={styles.filterRow}>
          {(['All', 'Completed', 'Incomplete'] as Filter[]).map((filter) => {
            const isActive = activeFilter === filter;

            return (
              <Pressable
                key={filter}
                onPress={() => changeFilter(filter)}
                style={[
                  styles.filterButton,
                  isActive && styles.activeFilterButton,
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
              >
                <Text
                  style={[
                    styles.filterText,
                    isActive && styles.activeFilterText,
                  ]}
                >
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {filteredTodos.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyIconText}>
                {activeFilter === 'Completed' ? '✓' : '☰'}
              </Text>
            </View>

            <Text style={styles.emptyTitle}>
              {activeFilter === 'All'
                ? 'Your list is clear'
                : activeFilter === 'Completed'
                  ? 'No completed tasks yet'
                  : 'No remaining tasks'}
            </Text>

            <Text style={styles.emptyDescription}>
              {activeFilter === 'All'
                ? 'Add your first task above to get started.'
                : activeFilter === 'Completed'
                  ? 'Tasks you finish will appear here.'
                  : 'You have completed all your tasks.'}
            </Text>
          </View>
        ) : (
          <View style={styles.todoList}>
            {filteredTodos.map((todo) => (
              <View key={todo.id} style={styles.todoCard}>
                <Pressable
                  onPress={() => toggleTodo(todo.id)}
                  style={[
                    styles.checkbox,
                    todo.completed && styles.checkboxChecked,
                  ]}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: todo.completed }}
                  accessibilityLabel={`Mark ${todo.title} ${
                    todo.completed ? 'incomplete' : 'completed'
                  }`}
                >
                  {todo.completed && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </Pressable>

                <View style={styles.todoContent}>
                  <Text
                    style={[
                      styles.todoTitle,
                      todo.completed && styles.completedTodoTitle,
                    ]}
                  >
                    {todo.title}
                  </Text>

                  <Text style={styles.todoStatus}>
                    {todo.completed ? 'COMPLETED' : 'IN PROGRESS'}
                  </Text>
                </View>

                <Pressable
                  onPress={() => deleteTodo(todo.id)}
                  style={({ pressed }) => [
                    styles.deleteButton,
                    pressed && styles.pressedButton,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Delete ${todo.title}`}
                >
                  <Text style={styles.deleteButtonText}>×</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Stay focused. One task at a time.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FC',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
    maxWidth: 780,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 90,
    paddingBottom: 36,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
    paddingTop: 8,
  },
  headerTextContainer: {
    flex: 1,
    paddingRight: 12,
  },
  eyebrow: {
    color: '#6676A5',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 7,
  },
  title: {
    color: '#192442',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -1,
  },
  subtitle: {
    color: '#78829B',
    fontSize: 14,
    marginTop: 6,
  },
  headerIcon: {
    width: 50,
    height: 50,
    borderRadius: 17,
    backgroundColor: '#5269D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '800',
  },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 23,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#E9EDF6',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  totalNumber: {
    color: '#27345D',
    fontSize: 25,
    fontWeight: '800',
  },
  completedNumber: {
    color: '#259B78',
    fontSize: 25,
    fontWeight: '800',
  },
  remainingNumber: {
    color: '#D58B35',
    fontSize: 25,
    fontWeight: '800',
  },
  summaryLabel: {
    color: '#7C859C',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 5,
    textAlign: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 34,
    backgroundColor: '#E8ECF4',
  },
  addSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#222E4D',
    fontSize: 19,
    fontWeight: '800',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    gap: 10,
  },
  input: {
    flex: 1,
    minWidth: 0,
    height: 54,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 16,
    color: '#202B49',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#E2E7F1',
  },
  addButton: {
    width: 54,
    height: 54,
    borderRadius: 15,
    backgroundColor: '#5269D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressedButton: {
    opacity: 0.72,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '500',
    lineHeight: 34,
  },
  helperText: {
    color: '#8B94A9',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 9,
    marginLeft: 3,
  },
  tasksHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  taskCount: {
    color: '#7E88A1',
    fontSize: 12,
    fontWeight: '600',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  filterButton: {
    flex: 1,
    minHeight: 46,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 12,
    backgroundColor: '#E9EDF6',
  },
  activeFilterButton: {
    backgroundColor: '#5269D8',
  },
  filterText: {
    color: '#69748F',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingVertical: 36,
    borderWidth: 1,
    borderColor: '#E9EDF6',
  },
  emptyIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#EEF1FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyIconText: {
    color: '#5269D8',
    fontSize: 25,
    fontWeight: '800',
  },
  emptyTitle: {
    color: '#263252',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptyDescription: {
    color: '#8992A7',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
    textAlign: 'center',
  },
  todoList: {
    gap: 11,
  },
  todoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 15,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E8ECF4',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 1.7,
    borderColor: '#C7CEDF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: '#259B78',
    borderColor: '#259B78',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  todoContent: {
    flex: 1,
    minWidth: 0,
  },
  todoTitle: {
    color: '#293451',
    fontSize: 14,
    fontWeight: '700',
  },
  completedTodoTitle: {
    color: '#9AA2B4',
    textDecorationLine: 'line-through',
  },
  todoStatus: {
    color: '#929AAF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    marginTop: 6,
  },
  deleteButton: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: '#FFF0F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  deleteButtonText: {
    color: '#D85D68',
    fontSize: 25,
    fontWeight: '400',
    lineHeight: 28,
  },
  footer: {
    alignItems: 'center',
    marginTop: 28,
  },
  footerText: {
    color: '#9AA2B4',
    fontSize: 12,
    textAlign: 'center',
  },
});