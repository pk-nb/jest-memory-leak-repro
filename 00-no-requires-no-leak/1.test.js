it('print memory usage', () => {
  console.log(`${process.memoryUsage().external / 1024 ** 2} MB`)
})
