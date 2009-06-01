package org.milfont;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;

public interface Repository {

	/**
	 * Set method for sessionFactory.
	 * @param sessionFactoryEntry Entry for sessionFactory
	 */
	public abstract void setSessionFactory(
			final SessionFactory sessionFactoryEntry);

	/**
	 * Find Method for Entities.
	 * @return List from query
	 * @param filter Entity for query.
	 * @param start Integer from paging.
	 * @param limit Integer from paging.
	 * @see org.milfont.model.issuetrackr.Repository
	 * #find(java.lang.Object, int, int)
	 */
	@SuppressWarnings("unchecked")
	public abstract List<? extends Object> find(final Object filter,
			final int start, final int limit);

	/**
	 * Find Method for Entities.
	 * @return List from query
	 * @param filter Entity for query.
	 */
	@SuppressWarnings("unchecked")
	public abstract List<? extends Object> find(final Object filter);

	/**
	 * Method for count entities with same arguments.
	 * @param filter Entity like example with filter.
	 * @return Integer with number of entities found.
	 */
	public abstract int count(final Object filter);

	/**
	 * Find Method for ID.
	 * @param filter Entity like example with filter.
	 * @return Object found.
	 */
	public abstract Object findById(final Object filter);

	/**
	 * Created or Update method for Entity.
	 * @param novo Entity created or updated.
	 * Novo is a word in portugues for NEW.
	 * @return Entity modified.
	 */
	public abstract Object persist(final Object novo);

	/**
	 * Exclude Method for Entity.
	 * @param deleted Entity excluded.
	 * @return boolean that indicates response.
	 */
	public abstract boolean exclude(final Object deleted);

	/**
	 * Capturing current session.
	 * @return current session ORM.
	 * @see org.milfont.model.issuetrackr.Repository#getCurrentSession()
	 */
	public abstract Session getCurrentSession();

}