package org.milfont;

import java.lang.reflect.Field;
import java.util.Date;
import java.util.List;

import org.apache.log4j.Logger;
import org.hibernate.Criteria;
import org.hibernate.HibernateException;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Example;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;

public class GlobalRepository implements Repository {

    /**
     * Session Factory from ORM Hibernate injected by Spring.
     */
    private SessionFactory sessionFactory;
    /**
     * Log class from Log4J, but must have be deprecated.
     */
     public static final Logger LOG =
        Logger.getLogger(GlobalRepository.class);

    /**
     * Logging Method.
     * @param exception Exception for logging.
     */
    private void log(final Exception exception) {
        LOG.error("[IssueTrackr]:" + exception.getMessage());
    }

    /* (non-Javadoc)
	 * @see org.milfont.Repository#setSessionFactory(org.hibernate.SessionFactory)
	 */
    public final void setSessionFactory(
            final SessionFactory sessionFactoryEntry) {
        this.sessionFactory = sessionFactoryEntry;
    }

    /**
     * Private method for extract id from Entities.
     * @param obj Entity for CRUD.
     * @return ID captured from entity entry
     * @throws NoSuchFieldException Exception because Reflection Java API.
     * @throws IllegalAccessException Exception because Reflection Java API.
     */
    private Long extractId(final Object obj)
        throws NoSuchFieldException,
        IllegalAccessException {
        Field field = obj.getClass().getDeclaredField("id");
        field.setAccessible(true);
        return (Long) field.get(obj);
    }

    /* (non-Javadoc)
	 * @see org.milfont.Repository#find(java.lang.Object, int, int)
	 */
    @SuppressWarnings("unchecked")
    public final List < ? extends Object > find(
            final Object filter,
            final int start,
            final int limit) {
        //if(filter == null)
        //throw new PersistenciaException(
        //"Necessário especificar o objeto de consulta!");
    	
    	Example example = 
			Example.create(filter)
				.excludeZeroes()
				.enableLike(MatchMode.ANYWHERE)
        		.ignoreCase();
        Criteria criteria = this.sessionFactory
            .getCurrentSession()
        .createCriteria( filter.getClass() )
            .add(example)
            .setFirstResult(start)
            .setMaxResults(limit);
        
        try {
			this.addCompositeEntityInCriteria(criteria, filter);
		} catch (Exception e) {
			e.printStackTrace();
		}
        List lista = criteria.list();
        return lista;
    }

    /* (non-Javadoc)
	 * @see org.milfont.Repository#find(java.lang.Object)
	 */
    @SuppressWarnings("unchecked")
    public final List < ? extends Object > find(final Object filter) {
    	
    	Example example =  
			Example.create(filter)
			.enableLike(MatchMode.ANYWHERE)
    		.ignoreCase();
        Criteria criteria = this.sessionFactory
        .getCurrentSession().createCriteria(filter.getClass())
            .add(example);
    	
        try {
			this.addCompositeEntityInCriteria(criteria, filter);
		} catch (Exception e) {
			e.printStackTrace();
		}
	
        
        return criteria.list();
    }

    /* (non-Javadoc)
	 * @see org.milfont.Repository#count(java.lang.Object)
	 */
    public final int count(final Object filter) {
    	Example example =  
			Example.create(filter)
			.enableLike(MatchMode.ANYWHERE)
    		.ignoreCase();
        Criteria criteria = this.sessionFactory
        .getCurrentSession().createCriteria(filter.getClass())
            .setProjection(Projections.rowCount())
            .add(example);
        
        try {
			this.addCompositeEntityInCriteria(criteria, filter);
		} catch (Exception e) {
			e.printStackTrace();
		}
        
        return (Integer) criteria.list().get(0);
    }

    /* (non-Javadoc)
	 * @see org.milfont.Repository#findById(java.lang.Object)
	 */
    public final Object findById(final Object filter) {
        try {
            if (this.sessionFactory.getCurrentSession()
            .contains(filter)) {
                this.sessionFactory
                .getCurrentSession().get(
                        filter.getClass(),
                        this.extractId(filter));
            } else {
                this.sessionFactory.getCurrentSession()
                .load(filter, this.extractId(filter));
            }
        } catch (HibernateException e) {
            log(e);
        } catch (SecurityException e) {
            log(e);
        } catch (IllegalArgumentException e) {
            log(e);
        } catch (NoSuchFieldException e) {
            log(e);
        } catch (IllegalAccessException e) {
            log(e);
        }
        return filter;
    }

    /* (non-Javadoc)
	 * @see org.milfont.Repository#persist(java.lang.Object)
	 */
    public final Object persist(final Object novo) {
        try {
            this.sessionFactory.getCurrentSession().saveOrUpdate(novo);
        } catch (HibernateException e) {
            log(e);
        }
        return novo;
    }

    /* (non-Javadoc)
	 * @see org.milfont.Repository#exclude(java.lang.Object)
	 */
    public final boolean exclude(final Object deleted) {
        boolean retorno = true;
        this.sessionFactory.getCurrentSession().delete(deleted);
        return retorno;
    }

    /* (non-Javadoc)
	 * @see org.milfont.Repository#getCurrentSession()
	 */
    public final Session getCurrentSession() {
        return this.sessionFactory.openSession();
    }
    
    /**
     * Method for add composite entity in the criteria.
     * @param criteria Criteria for add.
     * @param filter Object that have composite entities.
     * @throws IllegalArgumentException Exception for API Java.
     * @throws IllegalAccessException Exception for API Java.
     * @throws SecurityException Exception for API Java.
     * @throws NoSuchFieldException Exception for API Java.
     */
    @SuppressWarnings("unchecked")
	private void addCompositeEntityInCriteria(Criteria criteria, Object filter) 
    throws IllegalArgumentException, IllegalAccessException, 
    SecurityException, NoSuchFieldException {
    	
    	Class objClass = filter.getClass();		
		Field[] fields = objClass.getDeclaredFields();
		for(Field field: fields) {
		    
		        if(field.getName().equalsIgnoreCase("begin")) {
		            Field beginField = objClass.getDeclaredField("begin");
		            beginField.setAccessible(true);
		            Date begin = (Date)beginField.get(filter);
		            Field endField = objClass.getDeclaredField("end");
		            endField.setAccessible(true);
		            Date end = (Date)endField.get(filter);
		            if(begin != null && end != null) {
		                criteria.add(Restrictions.between("date", begin, end));
		            }
		        }
		    
			if(field.getName().equalsIgnoreCase("Project")) {
				Field projField = objClass.getDeclaredField(field.getName());
				projField.setAccessible(true);
				Project proj = (Project)projField.get(filter);
				if(proj != null) {
					criteria.add(Restrictions.eq("project.id", proj.getId() ));
				}
			}

			if(field.getName().equalsIgnoreCase("Manager")) {
				Field managerField = objClass.getDeclaredField(field.getName());
				managerField.setAccessible(true);
				Manager manager = (Manager) managerField.get(filter);
				if(manager != null) {
					criteria.add(Restrictions.eq("manager.id", manager.getId() ));
				}
			}
			
			if(field.getName().equalsIgnoreCase("Address")) {
				Field addressField = objClass.getDeclaredField(field.getName());
				addressField.setAccessible(true);
				Address address = (Address) addressField.get(filter);
				if(address != null) {
					criteria.add(Restrictions.eq("address.id", address.getId() ));
				}
			}

		}
    }
    
}
