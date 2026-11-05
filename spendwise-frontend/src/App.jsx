import { useEffect, useState } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'

// Registrera nödvändiga delar för Chart.js
ChartJS.register(ArcElement, Tooltip, Legend)

function App() {
  const [transactions, setTransactions] = useState([])
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('alla')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

const fetchTransactions = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('http://localhost:8000/transactions/')
      if (!response.ok) {
        throw new Error('Kunde inte hämta transaktioner från servern.')
      }
      const data = await response.json()
      setTransactions(data)
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!description || !amount || !category) return

    const newTx = {
      title: description,
      amount: parseFloat(amount),
      category
    }

    try {
      const response = await fetch('http://localhost:8000/transactions/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTx)
      })

      if (response.ok) {
        setDescription('')
        setAmount('')
        setCategory('')
        fetchTransactions()
      }
    } catch (err) {
      console.error('Kunde inte skapa transaktion:', err)
    }
  }

  // Funktion för att radera en transaktion
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/transactions/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchTransactions()
      }
    } catch (err) {
      console.error('Kunde inte radera transaktion:', err)
    }
  }

  // Hämta unika kategorier för filtret
  const uniqueCategories = [...new Set(transactions.map(t => t.category))]

  // Filtrera transaktioner baserat på valt filter
  const filteredTransactions = selectedCategory === 'alla'
    ? transactions
    : transactions.filter(t => t.category.toLowerCase() === selectedCategory.toLowerCase())

  // Räkna ut totala utgifter baserat på filtrerad data (eller alla)
  const totalExpenses = filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0)

  // Gruppera per kategori för diagrammet
  const categoryTotals = filteredTransactions.reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount
    return acc
  }, {})

  // Data som skickas till Chart.js
  const chartData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          '#646cff',
          '#42b883',
          '#f7df1e',
          '#e74c3c',
          '#9b59b6',
          '#3498db'
        ],
        borderWidth: 1
      }
    ]
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>SpendWise Dashboard</h1>
      
      {/* Översikt och Diagram */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3>Totala Utgifter</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0 0 0', color: '#646cff' }}>
            {totalExpenses.toFixed(2)} kr
          </p>
          <p style={{ color: '#888', marginTop: '1rem' }}>
            Visar transaktioner: {filteredTransactions.length} av {transactions.length} st
          </p>
        </div>

        <div style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h3 style={{ width: '100%', marginBottom: '1rem' }}>Utgifter per Kategori</h3>
          <div style={{ width: '200px', height: '200px' }}>
            {filteredTransactions.length === 0 ? (
              <p style={{ color: '#888', textAlign: 'center' }}>Ingen data att visa</p>
            ) : (
              <Pie data={chartData} />
            )}
          </div>
        </div>
      </div>

      {/* Formulär för ny transaktion */}
      <section style={{ background: '#1a1a1a', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <h2>Lägg till ny transaktion</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr 1fr auto' }}>
          <input 
            type="text" 
            placeholder="Beskrivning" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#222', color: '#fff' }}
          />
          <input 
            type="number" 
            placeholder="Belopp (kr)" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#222', color: '#fff' }}
          />
          <input 
            type="text" 
            placeholder="Kategori" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #444', background: '#222', color: '#fff' }}
          />
          <button 
            type="submit" 
            style={{ padding: '0.5rem 1rem', background: '#646cff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Spara
          </button>
        </form>
      </section>

      {/* Transaktionslista med Filter */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Transaktioner</h2>
          <div>
            <label style={{ marginRight: '10px', color: '#888', fontSize: '0.9rem' }}>Filtrera:</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ padding: '0.4rem', borderRadius: '4px', background: '#222', color: '#fff', border: '1px solid #444' }}
            >
              <option value="alla">Alla kategorier</option>
              {uniqueCategories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <p>Laddar...</p>
        ) : filteredTransactions.length === 0 ? (
          <p>Inga transaktioner att visa.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #444' }}>
                <th style={{ padding: '0.5rem' }}>Beskrivning</th>
                <th style={{ padding: '0.5rem' }}>Kategori</th>
                <th style={{ padding: '0.5rem', textAlign: 'right' }}>Belopp</th>
                <th style={{ padding: '0.5rem', textAlign: 'center' }}>Åtgärd</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((tx, index) => (
                <tr key={tx.id || index} style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: '0.5rem' }}>{tx.title}</td>
                  <td style={{ padding: '0.5rem' }}>{tx.category}</td>
                  <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 'bold' }}>
                    {tx.amount} kr
                  </td>
                  <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                    <button 
                      onClick={() => handleDelete(tx.id)}
                      style={{ background: '#e74c3c', color: '#fff', border: 'none', padding: '0.3rem 0.6rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                      Ta bort
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}

export default App